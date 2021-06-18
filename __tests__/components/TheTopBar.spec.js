import Vue from "vue";
import Vuex from "vuex";
import Vuetify from "vuetify";
import { createLocalVue, mount } from "@vue/test-utils";
import { user } from "@/store/user.module.js";
import { app } from "@/store/app.module.js";
import { UserMock } from "../__mocks__/user.mock";
import TheTopBar from "@/components/TheTopBar";

describe("TheTopBar.vue", () => {
  const localVue = createLocalVue();
  localVue.use(Vuex);

  let vuetify;

  const userModuleActions = {
    signOut: jest.fn()
  };

  const appModuleActions = {
    toggleDrawerOpened: jest.fn(),
    setError: jest.fn()
  };

  const store = new Vuex.Store({
    modules: {
      app: {
        ...app,
        actions: appModuleActions
      },
      user: {
        ...user,
        actions: userModuleActions
      }
    }
  });
  store.commit("user/SET_CURRENT_USER", UserMock);

  const wrapperFactory = (wrapperProps = {}) => {
    return mount(TheTopBar, {
      store,
      localVue,
      vuetify,
      propsData: wrapperProps
    });
  };

  beforeEach(() => {
    vuetify = new Vuetify();
  });

  it("should match snapshot", () => {
    const wrapper = wrapperFactory();
    expect(wrapper.html()).toMatchSnapshot();
  });

  it("should dispatch toggleDrawerOpened action when toggle drawer button is clicked", async () => {
    const wrapper = wrapperFactory();
    const toggleDrawerButton = wrapper.find(".v-app-bar__nav-icon");
    toggleDrawerButton.trigger("click");
    expect(appModuleActions.toggleDrawerOpened).toHaveBeenCalled();
  });

  it("should dispatch signOut action when signOut list item is clicked", async () => {
    const wrapper = wrapperFactory();
    // First open the menu to being able of finding the sign out list item
    const profileMenuButton = wrapper.find("#profile-menu-button");
    profileMenuButton.trigger("click");
    await Vue.nextTick();

    const signOutListItem = wrapper.find("#sign-out-list-item");
    signOutListItem.trigger("click");
    expect(userModuleActions.signOut).toHaveBeenCalled();
  });
});
