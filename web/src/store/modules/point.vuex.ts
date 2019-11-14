import {
  action,
  Module,
  mutation,
  VuexModule,
} from "vuex-class-component";
import {
  NuxtHTTPInstance,
} from "@nuxt/http";
import {
  PointSummary,
  RecordPointRequest,
} from "~/proto/siiid_service_pb";
import {
  convertSummaryFromObj,
} from "~/utils/grpc_message_util";

export interface AddPointPayload {
  http: NuxtHTTPInstance
  latLng: google.maps.LatLng
}

@Module({ namespacedPath: "point/", target: "nuxt" })
export class PointStore extends VuexModule {
  private _pointSummaryList: PointSummary[] = [];

  get pointSummaryList(): PointSummary[] {
    return this._pointSummaryList;
  }

  get firstPoint(): PointSummary|null {
    if (this._pointSummaryList.length === 0) {
      return null;
    }
    return this._pointSummaryList[0];
  }

  @mutation
  pushPointSummary(point: PointSummary): void {
    this._pointSummaryList.push(point);
    this._pointSummaryList.sort(function (a: PointSummary, b: PointSummary): number {
      return a.getActionedat() > b.getActionedat() ? 1 : -1;
    })
  }

  @action
  async fetchListAsync(http: NuxtHTTPInstance) {
    await http.get("points", { prefixUrl: "/api/v1/" }).then(async (res) => {
      await res.json().then(({ points }) => {
        this._pointSummaryList = Array.from(points).map((point: any) => {
          return convertSummaryFromObj(point);
        }).sort(function (a: PointSummary, b: PointSummary): number {
          return a.getActionedat() > b.getActionedat() ? 1 : -1;
        });
      });
    });
  }

  @action
  async addPointAsync(addPointPayload: AddPointPayload): Promise<PointSummary> {
    const { http, latLng } = addPointPayload;

    const req = new RecordPointRequest();
    req.setLatitude(latLng.lat());
    req.setLongitude(latLng.lng());

    return http.post(
      "points",
      req.toObject(),
      { prefixUrl: "/api/v1/" },
    ).then(res => {
      return res.json().then(point => {
        return convertSummaryFromObj(point);
      });
    });
  }
}
