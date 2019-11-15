<template>
  <div>
    <article class="gmap">
      <div id="map"></div>
    </article>

    <b-modal id="sendModal" hide-footer title="場所の追加">
      <p>緯度: {{ targetLatLng === null ? 0 : targetLatLng.lat() }}</p>
      <p>経度: {{ targetLatLng === null ? 0 : targetLatLng.lng() }}</p>

      <b-form>
        <b-form-group
          v-if="isValidInputPlace"
          label="場所名:"
          label-for="input-place"
        >
          <b-form-input
            id="input-place"
            v-model="place"
            type="text"
            required
            placeholder="Enter place"
          ></b-form-input>
        </b-form-group>
        <b-form-group>
          <b-form-checkbox v-model="isValidInputPlace">場所名を入力する</b-form-checkbox>
        </b-form-group>
      </b-form>

      <b-button
        :disabled="!isValidButton"
        class="mt-3"
        variant="outline-danger"
        block
        @click="closeModal"
      >
        Cancel
      </b-button>
      <b-button
        :disabled="!isValidButton"
        class="mt-2"
        variant="outline-success"
        block
        @click="addPoint"
      >
        Add
      </b-button>
    </b-modal>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from "vue-property-decorator";
import { vxm } from "@/store/store";

@Component
export default class Default extends Vue {
  isValidInputPlace: boolean = false;
  isValidButton: boolean = true;
  place: string = "";

  get targetLatLng(): google.maps.LatLng | null {
    return vxm.heatmap.targetLatLng;
  }

  @Watch("targetLatLng")
  onTargetLatLngChanged(latLng: google.maps.LatLng | null, _: any) {
    if (latLng === null) {
      return;
    }
    this.$root.$emit("bv::show::modal", "sendModal");
  }

  closeModal() {
    this.$root.$emit("bv::hide::modal", "sendModal");
  }

  addPoint() {
    if (this.targetLatLng === null) {
      return;
    }
    this.isValidButton = false;
    vxm.point.addPointAsync({
      http: this.$http,
      latLng: this.targetLatLng,
      place: this.place,
    }).then(point => {
      vxm.point.pushPointSummary(point);

      const latLngList = vxm.point.pointSummaryList.map(summary => {
        return new google.maps.LatLng(summary.getLatitude(), summary.getLongitude());
      });
      vxm.heatmap.updateHeatmap(latLngList);
      this.$root.$emit("bv::hide::modal", "sendModal");
      this.isValidButton = true;
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
