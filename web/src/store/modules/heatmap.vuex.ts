import { VuexModule, Module, mutation, action } from "vuex-class-component";
import {} from "googlemaps";

declare let google: any;

@Module({ namespacedPath: "heatmap/", target: "nuxt" })
export class HeatmapStore extends VuexModule {
  private CENTER_LAT: number = 40;
  private CENTER_LNG: number = 140;

  private options: google.maps.MapOptions = {};
  private map: google.maps.Map | null = null;
  private heatmapData: google.maps.visualization.WeightedLocation[] = [];
  private heatmap: google.maps.visualization.HeatmapLayer | null = null;

  @mutation
  createMap(mapElementId: string): void {
    if (google === undefined) {
      return;
    }
    this.options = {
      zoom: 7,
      center: new google.maps.LatLng(this.CENTER_LAT, this.CENTER_LNG),
      mapTypeId: google.maps.MapTypeId.TERRAIN,
      zoomControl: false,
      mapTypeControl: false,
      disableDoubleClickZoom: false,
      draggable: false,
      keyboardShortcuts: false,
      clickableIcons: false,
      disableDefaultUI: true,
      fullscreenControl: false,
      scrollwheel: false,
    };
    this.map = new google.maps.Map(
      document.getElementById(mapElementId),
      this.options
    );
  }

  @mutation
  createWeightedLocationMock(): void {
    const location = new google.maps.LatLng(35, 135);
    const weihtedLocation: google.maps.visualization.WeightedLocation = {
      location,
      weight: 0.5
    };
    this.heatmapData.push(weihtedLocation);
  }

  @mutation
  updateHeatmap(): void {
    const heatmap = new google.maps.visualization.HeatmapLayer({
      data: this.heatmapData
    });
    heatmap.setMap(this.map);
    this.heatmap = heatmap;
  }

  @action
  initialize(mapElementId: string): any {
    this.createMap(mapElementId);

    // todo: APIからの取得に置き換える
    this.createWeightedLocationMock();

    this.updateHeatmap();
  }

  get isEnabled(): boolean {
    return this.map !== null && this.heatmap !== null;
  }
}
