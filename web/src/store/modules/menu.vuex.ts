import {
  VuexModule,
  mutation,
  getter,
  Module
} from "vuex-class-component";

export interface Menu {
  title: string;
  route: string;
  isActive: boolean;
}

@Module({ namespacedPath: "menu/", target: "nuxt" })
export class MenuStore extends VuexModule {
  @getter
  public list: Menu[] = [
    {
      title: "トップ",
      route: "/",
      isActive: true,
    },
    {
      title: "タイムライン",
      route: "/timeline",
      isActive: false,
    },
  ];

  @mutation
  public topActive() {
    this.list = this.list.map(v => {
      return {
        title: v.title,
        route: v.route,
        isActive: v.title === "トップ",
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
