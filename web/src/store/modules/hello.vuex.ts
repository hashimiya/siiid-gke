import {
  VuexModule,
  Module,
  action,
} from "vuex-class-component";
import { NuxtHTTPInstance } from "@nuxt/http";
import { HelloResponse } from "~/proto/siiid_service_pb";

@Module({ namespacedPath: "hello/", target: "nuxt" })
export class HelloStore extends VuexModule {
  public message: string = "";

  @action async helloAsync(http: NuxtHTTPInstance) {
    await http.get("", { prefixUrl: "/api/" }).then((res) => {
      res.text().then(text => {
        const helloResponse = new HelloResponse();
        helloResponse.setMessage(JSON.parse(text)["message"]);
        this.message = helloResponse.getMessage();
      });
    });
  }
}
