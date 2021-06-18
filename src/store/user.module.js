import {
  auth,
  createUserProfileDocument,
  googleProvider
} from "../plugins/firebase";

export const initialState = () => ({
  currentUser: null
});

const state = initialState();

export const mutations = {
  SET_CURRENT_USER(state, user) {
    state.currentUser = user;
  },
  RESET(state) {
    const newState = initialState();
    Object.keys(newState).forEach(key => {
      state[key] = newState[key];
    });
  }
};

export const actions = {
  async hydrateUserFromFirebase(
    { commit, dispatch },
    { user, additionalData }
  ) {
    try {
      const userRef = await createUserProfileDocument(user, additionalData);
      const userSnapshot = await userRef.get();

      dispatch("hosts/hydrateHostsFromFirebase", userSnapshot.id, {
        root: true
      });

      await commit("SET_CURRENT_USER", {
        id: userSnapshot.id,
        ...userSnapshot.data()
      });
    } catch (error) {
      return Promise.reject(error.message);
    }
  },
  async signInWithGoogle({ dispatch }) {
    try {
      const { user } = await auth.signInWithPopup(googleProvider);
      if (user) {
        await dispatch("hydrateUserFromFirebase", { user });
        return dispatch("app/setLayout", "app-layout", { root: true });
      }
    } catch (error) {
      return Promise.reject("Invalid username or password.");
    }
  },
  async signIn({ dispatch }, { email, password }) {
    try {
      const { user } = await auth.signInWithEmailAndPassword(email, password);
      if (user) {
        await dispatch("hydrateUserFromFirebase", { user });
        return dispatch("app/setLayout", "app-layout", { root: true });
      }
    } catch (error) {
      return Promise.reject(error.message);
    }
  },
  async signUp({ dispatch }, { fullName, email, password }) {
    try {
      const { user } = await auth.createUserWithEmailAndPassword(
        email,
        password
      );
      if (user) {
        await dispatch("hydrateUserFromFirebase", {
          user,
          additionalData: { displayName: fullName }
        });
        return dispatch("app/setLayout", "app-layout", { root: true });
      }
    } catch (error) {
      return Promise.reject(error.message);
    }
  },

  async signOut({ dispatch }) {
    try {
      await auth.signOut();
      return dispatch("reset", null, { root: true });
    } catch (error) {
      return Promise.reject(error.message);
    }
  }
};

export const user = {
  namespaced: true,
  state,
  actions,
  mutations
};
