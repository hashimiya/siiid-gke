<template>
  <div class="container">
    <div class="list_container">
      <!--  todo: 日付操作 -->
      <div class="date_container">
        <div class="date">
          <p><span>{{ year }}</span>年<span>{{ month }}</span>月<span>{{ day }}</span>日<span class="dotw">（{{ weekday }}）</span></p>
        </div>
        <img src="~assets/back_arrow.svg" height="20px" @click="back">
        <img src="~assets/next_arrow.svg" height="20px" @click="next">
        <img src="~assets/delete_icon.svg" height="20px">
        <a href="#">今日</a>
      </div>
      <div class="list">
        <div class="description" v-for="point in summaryList">
          <img src="~assets/siiid_icon.svg" height="24px" @click="move(point)">
          <p class="time"><span>{{ convertHourTime(point) }}</span></p>
          <div>
            <p class="place">{{ point.getPlace() }}</p>
            <p>緯度：<span>{{ point.getLatitude() }}</span> 経度：<span>{{ point.getLongitude() }}</span></p>
            <p>天気：{{ point.getWeather() }} 気温：<span>{{ point.getTemperature() }}℃</span> 湿度：<span>{{ point.getHumidity() }}%</span></p>
          </div>
          <img src="~assets/option_icon.svg" height="24px">
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { vxm } from "@/store/store";
import { PointSummary } from "~/proto/siiid_service_pb";
import moment from "moment-timezone";

@Component({
  layout: "app",
})
export default class Timeline extends Vue {
  mounted() {
    if (!vxm.heatmap.isEnabledMap) {
      this.$nuxt.$router.push("heatmap");
      return;
    }
    vxm.menu.timelineActive();
    this.$nextTick(function () {
      const firstPoint = vxm.point.firstPoint;
      if (firstPoint !== null) {
        vxm.heatmap.updateCenter(new google.maps.LatLng(firstPoint.getLatitude(), firstPoint.getLongitude()));
        vxm.heatmap.zoomIn();
      }
    });
  }

  get summaryList(): PointSummary[] {
    return vxm.point.pointSummaryList;
  }

  convertHourTime(summary: PointSummary): string {
    return moment.tz(summary.getActionedat(), "Asia/Tokyo").format("HH:mm");
  }

  next() {
    alert("未実装")
  }

  back() {
    alert("未実装")
  }

  move(point: PointSummary): void {
    vxm.heatmap.updateCenter(new google.maps.LatLng(point.getLatitude(), point.getLongitude()))
  }

  get year(): string {
    return moment().tz("Asia/Tokyo").format("YYYY");
  }

  get month(): string {
    return moment().tz("Asia/Tokyo").format("MM");
  }

  get day(): string {
    return moment().tz("Asia/Tokyo").format("DD");
  }

  get weekday(): string {
    return moment().tz("Asia/Tokyo").format("ddd");
  }
}
</script>

<style scoped>
.list_container {
  position: absolute;
  left: 130px;
  width: 430px;
  height: calc(100% - 80px);
  background: #FFFFFF;
  z-index: 10;
}

.list_container .list {
  position: absolute;
  height: calc(100% - 53px);
  width: 100%;
  display: block;
  overflow-y: auto;
  color:#505050;
  z-index: 2;
  bottom: 0px;
  padding: 10px 20px 10px 20px;
}

.list_container .list p {
  margin: 0;
  padding: 0;
  font-size: 80%;
}

.list_container .list .description {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 25px 10px 25px 10px;
}

.list_container .list .description:not(:last-of-type) {
  border-bottom: #DDDDDD 1px solid;
}

.list_container .list .description span {
  font-size: 110%;
  font-family: 'Roboto', sans-serif;
}

.list_container .list .description .time {
  font-size: 130%;
  margin-right: 00px;
}

.list_container .list .description .place {
  font-size: 100%;
}

.list_container .list .description div {
  width: 220px;
}

.list_container .list .description div p:first-of-type {
  font-weight: 600;
  margin-bottom: 3px;
}

.list_container .date_container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 7px 20px 10px 20px;
}

.list_container .date {
  font-size: 120%;
  letter-spacing: 0.03em;
  display: block;
}

.list_container .date p{
  margin: 0;
  padding: 0;
}

.list_container .date .dotw {
  font-size: 90%;
}

.list_container .date span:not(:last-child) {
  font-size: 125%;
  font-family: 'Roboto', sans-serif;
}.list_container {
   position: absolute;
   left: 130px;
   width: 430px;
   height: calc(100% - 80px);
   background: #FFFFFF;
   z-index: 10;
 }

.list_container .list {
  position: absolute;
  height: calc(100% - 53px);
  width: 100%;
  display: block;
  overflow-y: auto;
  color:#505050;
  z-index: 2;
  bottom: 0px;
  padding: 10px 20px 10px 20px;
}

.list_container .list p {
  margin: 0;
  padding: 0;
  font-size: 80%;
}

.list_container .list .description {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 25px 10px 25px 10px;
}

.list_container .list .description:not(:last-of-type) {
  border-bottom: #DDDDDD 1px solid;
}

.list_container .list .description span {
  font-size: 110%;
  font-family: 'Roboto', sans-serif;
}

.list_container .list .description .time {
  font-size: 130%;
  margin-right: 00px;
}

.list_container .list .description .place {
  font-size: 100%;
}

.list_container .list .description div {
  width: 220px;
}

.list_container .list .description div p:first-of-type {
  font-weight: 600;
  margin-bottom: 3px;
}

.list_container .date_container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 7px 20px 10px 20px;
}

.list_container .date {
  font-size: 120%;
  letter-spacing: 0.03em;
  display: block;
}

.list_container .date p{
  margin: 0;
  padding: 0;
}

.list_container .date .dotw {
  font-size: 90%;
}

.list_container .date span:not(:last-child) {
  font-size: 125%;
  font-family: 'Roboto', sans-serif;
}

img:hover {
  cursor: pointer;
}
</style>
