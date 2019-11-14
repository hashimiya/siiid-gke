import { VuexModule, Module, mutation, action } from "vuex-class-component";
import {} from "googlemaps";

declare let google: any;

@Module({ namespacedPath: "heatmap/", target: "nuxt" })
export class HeatmapStore extends VuexModule {
  private CENTER_LAT: number = 43.06417;
  private CENTER_LNG: number = 141.34694;
  private ZOOM_OUT: number = 7;
  private ZOOM_IN: number = 18;

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
      zoom: this.ZOOM_OUT,
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
  pushWeightedLocationList(latLngList: google.maps.LatLng[]): void {
    latLngList.forEach(latLng => {
      const weightedLocation: google.maps.visualization.WeightedLocation = {
        location: latLng,
        weight: 0.5,
      };
      this.heatmapData.push(weightedLocation);
    });
    const heatmap = new google.maps.visualization.HeatmapLayer({
      data: this.heatmapData
    });
    heatmap.setMap(this.map);
    this.heatmap = heatmap;
  }

  @mutation
  initializeCenter() {
    if (this.map === null) {
      return;
    }
    this.map.setCenter(new google.maps.LatLng(this.CENTER_LAT, this.CENTER_LNG));
  }

  @mutation
  updateCenter(center: google.maps.LatLng) {
    if (this.map === null) {
      return;
    }
    this.map.setCenter(center);
  }

  @mutation
  zoomIn() {
    if (this.map === null) {
      return;
    }
    this.map.setZoom(this.ZOOM_IN);
  }

  @mutation
  zoomOut() {
    if (this.map === null) {
      return;
    }
    this.map.setZoom(this.ZOOM_OUT);
  }

  @action
  initialize(mapElementId: string): any {
    this.createMap(mapElementId);
  }

  get isEnabled(): boolean {
    return this.map !== null && this.heatmap !== null;
  }
}
