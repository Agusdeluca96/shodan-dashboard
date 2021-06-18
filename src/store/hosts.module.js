import { HostService } from "@/services/host.service";
import { getUserHostsRef } from "../plugins/firebase";
import moment from "moment";

export const initialState = () => ({
  host: null,
  searchedHosts: [],
  scans: []
});

const state = initialState();

const mutations = {
  SET_HOST(state, host) {
    state.host = host;
  },
  SET_SEARCHED_HOSTS(state, hosts) {
    state.searchedHosts = hosts;
  },
  SET_SCANS(state, scans) {
    state.scans = scans;
  },
  RESET(state) {
    const newState = initialState();
    Object.keys(newState).forEach(key => {
      state[key] = newState[key];
    });
  }
};

const actions = {
  async hydrateHostsFromFirebase({ commit }, userId) {
    const hostsRef = await getUserHostsRef(userId);
    const hostsSnapshot = await hostsRef.get();
    const { searchedHosts, scans } = hostsSnapshot.data();
    return Promise.all([
      commit("SET_SEARCHED_HOSTS", searchedHosts),
      commit("SET_SCANS", scans)
    ]);
  },

  async updateHostsInFirebase({ state, rootState }) {
    try {
      const { currentUser } = rootState.user;
      if (currentUser) {
        const { scans, searchedHosts } = state;
        const hostsRef = await getUserHostsRef(currentUser.id);
        await hostsRef.update({ scans, searchedHosts });
      }
    } catch (error) {
      Promise.reject(error);
    }
  },

  setHost({ commit }, host) {
    return commit("SET_HOST", host);
  },

  async setSearchedHosts({ commit, dispatch }, searchedHosts) {
    await commit("SET_SEARCHED_HOSTS", searchedHosts);
    return dispatch("updateHostsInFirebase");
  },

  async setScans({ commit, dispatch }, scans) {
    await commit("SET_SCANS", scans);
    return dispatch("updateHostsInFirebase");
  },

  async searchHost({ commit, state, dispatch }, ip) {
    try {
      const hostResponse = await HostService.get(ip);
      hostResponse["searched_at"] = moment.utc().format();
      if (state.searchedHosts.some(host => host.ip === hostResponse.ip)) {
        const updatedSearchedHosts = state.searchedHosts.map(host =>
          host.ip === hostResponse.ip ? hostResponse : host
        );
        dispatch("setSearchedHosts", updatedSearchedHosts);
      } else {
        dispatch("setSearchedHosts", [...state.searchedHosts, hostResponse]);
      }
      return commit("SET_HOST", hostResponse);
    } catch (error) {
      return Promise.reject(error);
    }
  },

  removeSearchedHost({ state, dispatch }, ip) {
    const updatedSearchedHosts = state.searchedHosts.filter(
      host => host.ip !== ip
    );
    return dispatch("setSearchedHosts", updatedSearchedHosts);
  },

  resetSearchedHosts({ dispatch }) {
    return dispatch("setSearchedHosts", []);
  },

  async scanHosts({ state, dispatch }, ips) {
    try {
      const scanResponse = await HostService.scan(ips);
      const scanStatusResponse = await HostService.scanStatus(scanResponse.id);
      dispatch("setScans", [
        ...state.scans,
        {
          id: scanResponse.id,
          ips,
          status: scanStatusResponse.status,
          scanned_at: moment.utc(scanStatusResponse.created).format(),
          last_status_refresh: moment.utc(scanStatusResponse.created).format()
        }
      ]);
    } catch (error) {
      return Promise.reject(error);
    }
  },

  removeScan({ state, dispatch }, scanId) {
    const updatedScans = state.scans.filter(scan => scan.id !== scanId);
    return dispatch("setScans", updatedScans);
  },

  resetScans({ dispatch }) {
    return dispatch("setScans", []);
  },

  async refreshScanStatus({ state, dispatch }, scanId) {
    try {
      const scanStatusResponse = await HostService.scanStatus(scanId);
      dispatch(
        "setScans",
        state.scans.map(scan =>
          scan.id === scanId
            ? {
                ...scan,
                status: scanStatusResponse.status,
                last_status_refresh: moment.utc().format()
              }
            : scan
        )
      );
    } catch (error) {
      return Promise.reject(error);
    }
  }
};

export const hosts = {
  namespaced: true,
  state,
  actions,
  mutations
};
