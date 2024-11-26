// api.service.ts
import { Injectable } from '@angular/core';
import axios from 'axios';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private host = 'https://provinces.open-api.vn/api/';

  callAPI(api: string) {
    return axios.get(api);
  }

  callApiDistrict(api: string) {
    return axios.get(api);
  }

  callApiWard(api: string) {
    return axios.get(api);
  }
}
