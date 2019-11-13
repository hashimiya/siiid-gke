import Vue from "vue";
import Vuex from "vuex";
import { MenuStore } from "@/store/modules/menu.vuex";
import { HelloStore } from "@/store/modules/hello.vuex";
import { PointStore } from "~/store/modules/point.vuex";

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    menu: MenuStore.ExtractVuexModule(MenuStore),
    hello: HelloStore.ExtractVuexModule(HelloStore),
    point: PointStore.ExtractVuexModule(PointStore),
  }
});

export const vxm = {
  menu: MenuStore.CreateProxy(store, MenuStore),
  hello: HelloStore.CreateProxy(store, HelloStore),
  point: PointStore.CreateProxy(store, PointStore),
};
