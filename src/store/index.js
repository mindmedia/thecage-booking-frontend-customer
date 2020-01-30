import Vue from 'vue';
import Vuex from 'vuex';
import auth from './modules/auth';
import timer from './modules/timer';
import cart from './modules/cart';
import home from './modules/home';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    auth,
    timer,
    cart,
    home,
  },
});
