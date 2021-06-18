import Vuex from "vuex";
import { createLocalVue } from "@vue/test-utils";
import { user, initialState } from "@/store/user.module";
import { UserMock } from "../__mocks__/user.mock";
import { cloneDeep } from "lodash";

describe("user.module.js", () => {
  const localVue = createLocalVue();
  localVue.use(Vuex);
  const store = new Vuex.Store(cloneDeep(user));
  const userInitialState = initialState();

  it("should be loaded with initial state", () => {
    expect(store.state).toEqual(userInitialState);
  });

  it('should change currentUser value when "SET_CURRENT_USER" is committed', () => {
    expect(store.state.currentUser).toBe(userInitialState.currentUser);
    store.commit("SET_CURRENT_USER", UserMock);
    expect(store.state.currentUser).toBe(UserMock);
  });

  it('should reset state when "RESET" is committed', () => {
    expect(store.state).not.toBe(userInitialState);
    store.commit("RESET");
    expect(store.state).toEqual(userInitialState);
  });
});
