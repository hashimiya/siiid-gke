import Vue from "vue";
import Vuex from "vuex";
import { MenuStore } from "@/store/modules/menu.vuex";
import { HelloStore } from "@/store/modules/hello.vuex";

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    menu: MenuStore.ExtractVuexModule(MenuStore),
    hello: HelloStore.ExtractVuexModule(HelloStore),
  }
});

export const vxm = {
  menu: MenuStore.CreateProxy(store, MenuStore),
  hello: HelloStore.CreateProxy(store, HelloStore),
};
