import {
  PointSummary,
} from "~/proto/siiid_service_pb";

export function convertSummaryFromObj(point: any): PointSummary {
  const summary = new PointSummary();
  summary.setId(point.id);
  summary.setHumidity(point.humidity);
  summary.setLatitude(point.latitude);
  summary.setLongitude(point.longitude);
  summary.setPlace(point.place);
  summary.setTemperature(point.temperature);
  summary.setWeather(point.weather);
  summary.setActionedat(point.actionedAt);
  return summary;
}
