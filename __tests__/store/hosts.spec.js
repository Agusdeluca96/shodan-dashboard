import Vuex from "vuex";
import { createLocalVue } from "@vue/test-utils";
import { hosts, initialState } from "@/store/hosts.module";
import { HostMock } from "../__mocks__/host.mock";
import { cloneDeep } from "lodash";

describe("hosts.module.js", () => {
  const localVue = createLocalVue();
  localVue.use(Vuex);
  const store = new Vuex.Store(cloneDeep(hosts));
  const hostsInitialState = initialState();

  it("should be loaded with initial state", () => {
    expect(store.state).toEqual(hostsInitialState);
  });

  it('should change host value when "SET_HOST" is committed', () => {
    expect(store.state.host).toBe(hostsInitialState.host);
    store.commit("SET_HOST", HostMock);
    expect(store.state.host).toBe(HostMock);
  });

  it('should change searchedHosts value "SET_SEARCHED_HOSTS" is committed', () => {
    expect(store.state.searchedHosts).toEqual(hostsInitialState.searchedHosts);
    const updatedSearchedHosts = [...store.state.searchedHosts, HostMock];
    store.commit("SET_SEARCHED_HOSTS", updatedSearchedHosts);
    expect(store.state.searchedHosts).toEqual(updatedSearchedHosts);
  });

  it('should change scans value "SET_SCANS" is committed', () => {
    expect(store.state.scans).toEqual(hostsInitialState.scans);
    const updatedScans = [...store.state.scans, HostMock];
    store.commit("SET_SCANS", updatedScans);
    expect(store.state.scans).toEqual(updatedScans);
  });

  it('should reset state when "RESET" is committed', () => {
    expect(store.state).not.toBe(hostsInitialState);
    store.commit("RESET");
    expect(store.state).toEqual(hostsInitialState);
  });
});
