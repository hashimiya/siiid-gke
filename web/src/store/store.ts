import Vue from "vue";
import Vuex from "vuex";
import { MenuStore } from "@/store/modules/menu.vuex";
import { HelloStore } from "@/store/modules/hello.vuex";
import { PointStore } from "~/store/modules/point.vuex";
import { HeatmapStore } from "~/store/modules/heatmap.vuex";

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    menu: MenuStore.ExtractVuexModule(MenuStore),
    hello: HelloStore.ExtractVuexModule(HelloStore),
    point: PointStore.ExtractVuexModule(PointStore),
    heatmap: HeatmapStore.ExtractVuexModule(HeatmapStore),
  }
});

export const vxm = {
  menu: MenuStore.CreateProxy(store, MenuStore),
  hello: HelloStore.CreateProxy(store, HelloStore),
  point: PointStore.CreateProxy(store, PointStore),
  heatmap: HeatmapStore.CreateProxy(store, HeatmapStore),
};
