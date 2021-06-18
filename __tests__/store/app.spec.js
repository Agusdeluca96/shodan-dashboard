import Vuex from "vuex";
import { createLocalVue } from "@vue/test-utils";
import { app, initialState } from "@/store/app.module";
import { cloneDeep } from "lodash";

describe("app.module.js", () => {
  const localVue = createLocalVue();
  localVue.use(Vuex);
  const store = new Vuex.Store(cloneDeep(app));
  const appInitialState = initialState();

  it("should be loaded with initial state", () => {
    expect(store.state).toEqual(appInitialState);
  });

  it('should change layout value when "SET_LAYOUT" is committed', () => {
    expect(store.state.layout).toBe(appInitialState.layout);
    store.commit("SET_LAYOUT", "app-layout");
    expect(store.state.layout).toBe("app-layout");
  });

  it('should toggle drawerOpened value when "TOGGLE_DRAWER_OPENED" is committed', () => {
    expect(store.state.drawerOpened).toBe(appInitialState.drawerOpened);
    store.commit("TOGGLE_DRAWER_OPENED");
    expect(store.state.drawerOpened).toBe(!appInitialState.drawerOpened);
  });

  it('should change error value when "SET_ERROR" is committed', () => {
    expect(store.state.error).toBe(appInitialState.error);
    store.commit("SET_ERROR", "Error message");
    expect(store.state.error).toBe("Error message");
  });

  it('should reset state when "RESET" is committed', () => {
    expect(store.state).not.toBe(appInitialState);
    store.commit("RESET");
    expect(store.state).toEqual(appInitialState);
  });
});
