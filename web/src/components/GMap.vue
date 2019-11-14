<template>
  <div>
    <article class="gmap">
      <div id="map"></div>
    </article>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from "vue-property-decorator";
import { vxm } from "@/store/store";

@Component
export default class Default extends Vue {
  get targetLatLng() {
    return vxm.heatmap.targetLatLng;
  }

  @Watch("targetLatLng")
  onTargetLatLngChanged(latLng: google.maps.LatLng | null, _: any) {
    if (latLng === null) {
      return;
    }
    vxm.point.addPointAsync({
      http: this.$http,
      latLng,
    }).then(point => {
      vxm.point.pushPointSummary(point);

      const latLngList = vxm.point.pointSummaryList.map(summary => {
        return new google.maps.LatLng(summary.getLatitude(), summary.getLongitude());
      });
      vxm.heatmap.updateHeatmap(latLngList);
    });
  }
}
</script>

<style scoped>
#map {
  position: absolute;
  width: 100%;
  height: calc(100% - 80px);
  z-index: 1;
}

#map2 {
  position: absolute;
  width: calc(100% - 560px);
  height: calc(100% - 80px);
  right: 0;
  z-index: 1;
}

#map3 {
  position: absolute;
  width: calc(100% - 130px);
  height: calc(100% - 80px);
  right: 0;
  z-index: 1;
}

.gmap .text_input {
  position: absolute;
  top: 70px;
  left: 145px;
  width: 400px;
  z-index: 5;
}

.gmap .text_input input {
  box-shadow: 0px 2px 3px rgba(0,0,0,0.2);
  border: none;
}

.gmap .result_container {
  position: absolute;
  top: 120px;
  left: 145px;
  width: 400px;
  max-height: 520px;
  background: #FFFFFF;
  border-radius: 4px;
  box-shadow: 0px 2px 3px rgba(0,0,0,0.2);
  padding: 20px 20px 0px 20px;
  z-index: 5;
  overflow-y: auto;
  color: #505050;
}

.gmap .result_container .flexxx {
  display: flex;
  width: 85%;
  align-items: center;
  justify-content: space-between;
}

.gmap .result_container .flexxx p {
  margin: 0;
  padding: 0;
}

.gmap .result_container .description {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 5px 20px 5px;
}

.gmap .result_container .description:first-of-type{
  margin-top: 20px;
}

.gmap .result_container .description:not(:last-of-type) {
  border-bottom: #DDDDDD 1px solid;
}

.gmap .result_container .description p {
  margin: 0;
  padding: 0;
  font-size: 80%;
}

.gmap .result_container .description .geo{
  width: 200px;
}

.gmap .result_container .description .geo p:first-of-type{
  font-size: 110%;
  font-weight: 600;
}

.gmap .result_container .description .geo span{
  font-family: 'Roboto', sans-serif;
  font-size: 110%;
}

.gmap .result_container .description .geo .fukin{
  font-size: 70%;
  margin-left: 5px;
}

.gmap .result_container .description .pt {
  font-size: 160%;
  font-family: 'Roboto', sans-serif;
}

.gmap .result_container .description .pt span {
  font-size: 70%;
  font-family: 'Roboto', sans-serif;
}


.gmap .heatbtn {
  position: absolute;
  background: linear-gradient(30deg, rgba(224, 60, 255, 1),rgba(0, 185, 255, 1));
  bottom: 120px;
  left: 145px;
  padding: 16px;
  display: flex;
  align-items: center;
  z-index: 2;
  border-radius: 2px;
  box-shadow: 0px 2px 3px rgba(0,0,0,0.2);
}

.gmap .heatbtn p {
  padding: 0;
  margin: 0;
}

.gmap .heatbtn img {
  margin-right: 10px;
}

.gmap .date_container {
  position: absolute;
  top: 10px;
  left: 145px;
  display: flex;
  z-index: 2;
  align-items: center;
  justify-content: space-between;
  width: 800px;
}
</style>
