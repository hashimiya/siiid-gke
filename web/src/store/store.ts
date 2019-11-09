import Vue from "vue";
import Vuex from "vuex";
import { MenuStore } from "./modules/menu.vuex";

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    menu: MenuStore.ExtractVuexModule(MenuStore)
  }
});

export const vxm = {
  menu: MenuStore.CreateProxy(store, MenuStore)
};
