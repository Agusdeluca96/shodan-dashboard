import { ApiService } from "./api.service";

export const HostService = {
  get: ip => ApiService.get("/shodan/host", ip),
  scan: ips => ApiService.post("/shodan/scan", { ips }),
  scanStatus: id => ApiService.get("/shodan/scan", id)
};
