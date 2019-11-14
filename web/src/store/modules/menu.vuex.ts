import {
  VuexModule,
  mutation,
  getter,
  Module
} from "vuex-class-component";

interface Menu {
  title: string;
  route: string;
  isActive: boolean;
}

@Module({ namespacedPath: "menu/", target: "nuxt" })
export class MenuStore extends VuexModule {
  @getter
  public list: Menu[] = [
    {
      title: "ヒートマップ",
      route: "/heatmap",
      isActive: true,
    },
    {
      title: "タイムライン",
      route: "/timeline",
      isActive: false,
    },
  ];

  @mutation
  public heatmapActive() {
    this.list = this.list.map(v => {
      return {
        title: v.title,
        route: v.route,
        isActive: v.title === "ヒートマップ",
      }
    })
  }

  @mutation
  public timelineActive() {
    this.list = this.list.map(v => {
      return {
        title: v.title,
        route: v.route,
        isActive: v.title === "タイムライン",
      }
    })
  }
}
