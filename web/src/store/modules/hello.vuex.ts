import {
  VuexModule,
  Module,
  action,
} from "vuex-class-component";
import {
  ServiceError,
  SiiidServiceClient,
} from "@/proto/siiid_service_pb_service";
import * as proto_siiid_service_pb from "@/proto/siiid_service_pb";

@Module({ namespacedPath: "hello/", target: "nuxt" })
export class HelloStore extends VuexModule {
  message: string = "default";

  @action async helloAsync() {
    const client = new SiiidServiceClient("http://api:5001", { debug: true });
    client.hello(
      new proto_siiid_service_pb.HelloRequest(),
      (error: ServiceError|null, responseMessage: proto_siiid_service_pb.HelloResponse|null) => {
      if (error !== null) {
        console.error(error);
        return;
      }
      if (responseMessage === null) {
        return;
      }
      this.message = responseMessage.getMessage()
    });
  }
}
