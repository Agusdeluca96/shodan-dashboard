export const initialState = () => ({
  layout: "empty-layout",
  drawerOpened: true,
  error: null
});

const state = initialState();

export const mutations = {
  SET_LAYOUT(state, payload) {
    state.layout = payload;
  },
  TOGGLE_DRAWER_OPENED(state) {
    state.drawerOpened = !state.drawerOpened;
  },
  SET_ERROR(state, payload) {
    state.error = payload;
  },
  RESET(state) {
    const newState = initialState();
    Object.keys(newState).forEach(key => {
      state[key] = newState[key];
    });
  }
};

export const actions = {
  setLayout({ commit }, layout) {
    return commit("SET_LAYOUT", layout);
  },
  toggleDrawerOpened({ commit }) {
    return commit("TOGGLE_DRAWER_OPENED");
  },
  setError({ commit }, error) {
    return commit("SET_ERROR", error);
  }
};

export const app = {
  namespaced: true,
  state,
  actions,
  mutations
};
