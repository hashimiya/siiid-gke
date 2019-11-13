import {action, Module, VuexModule,} from "vuex-class-component";
import {NuxtHTTPInstance} from "@nuxt/http";
import {PointSummary} from "~/proto/siiid_service_pb";

@Module({ namespacedPath: "point/", target: "nuxt" })
export class PointStore extends VuexModule {
  private _pointSummaryList: PointSummary[] = [];

  get pointSummaryList(): PointSummary[] {
    return this._pointSummaryList;
  }

  @action async fetchListAsync(http: NuxtHTTPInstance) {
    await http.get("points", { prefixUrl: "/api/v1/" }).then((res) => {
      res.json().then(({ points }) => {
        this._pointSummaryList = Array.from(points).map((v: any) => {
          const summary = new PointSummary();
          summary.setId(v.id);
          summary.setHumidity(v.humidity);
          summary.setLatitude(v.latitude);
          summary.setLongitude(v.longitude);
          summary.setPlace(v.place);
          summary.setTemperature(v.temperature);
          summary.setWeather(v.weather);
          summary.setActionedat(v.actionedAt);
          return summary;
        }).sort(function (a: PointSummary, b: PointSummary): number {
          if (a.getActionedat() < b.getActionedat()) {
            return -1
          }
          if (a.getActionedat() > b.getActionedat()) {
            return 1
          }
          return 0;
        });
      });
    });
  }
}
