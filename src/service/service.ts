import axios from "axios";
import {
  formatRatingBody,
  formatTrackingBody,
  formatShippingBody,
  formatRatingParams,
} from "../utils/utils";
import puppeter, { Browser, Page } from "puppeteer";
import qs from "qs";
import { performance } from "perf_hooks";
import { promises as FileSystem } from "fs";
export abstract class Service {
  public baseUrl: string;
  public serviceName: string;
  public subServices?: subService;
  public headers: any;
  public auth: any;
  constructor(serviceData: serviceData) {
    const { baseUrl, headers, serviceName } = serviceData;
    this.baseUrl = baseUrl;
    this.serviceName = serviceName;
    this.setHeaders(headers);
    if (serviceData.subServices) {
      this.setSubServices(serviceData.subServices);
    }
  }
  setHeaders(headers: any) {
    this.headers = headers;
  }
  getHeaders() {
    return this.headers;
  }
  abstract setAuthorization(): Promise<void | Error>;
  abstract setSubServices(subServices: any): void | Error;
  abstract getRating(ratingBody: Rating): Promise<void | Error>;
  abstract getTracking(trackingNumber: number): Promise<void | Error>;
  abstract getPicking(): Promise<void | Error>;
  abstract createShipping(data: any): Promise<void | Error>;
}

export class ApiService extends Service {
  constructor(serviceData: serviceData) {
    super(serviceData);
  }
  setSubServices(subServices: any): void {
    this.subServices = subServices;
  }
  getAuthorization() {
    return this.auth;
  }
  async setAuthorization(): Promise<any> {
    try {
      if (this.serviceName === "FEDEX") {
        const body = qs.stringify({
          client_secret: `${process.env.CLIENT_SECRET}`,
          client_id: `${process.env.CLIENT_ID}`,
          grant_type: `${process.env.GRANT_TYPE}`,
        });
        const { data } = await axios({
          method: "POST",
          data: body,
          url: `${this.baseUrl}/oauth/token`,
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        });
        this.headers["Authorization"] = `Bearer ${data.access_token}`;
        this.auth = data;
      } else if (this.serviceName === "REDPACK") {
        console.log("entro");
        const body = qs.stringify({
          grant_type: "password",
          username: `${process.env.USERNAME_REDPACK}`,
          password: `${process.env.PASSWORD_REDPACK}`,
        });
        const { data } = await axios({
          method: "POST",
          data: body,
          url: `https://api.redpack.com.mx/oauth/token`,
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: `Basic ${Buffer.from(
              `${process.env.CLIENT_ID_REDPACK}:${process.env.CLIENT_SECRET_REDPACK}`
            ).toString("base64")}`,
          },
        });
        this.auth = data;
        this.headers["Authorization"] = `Bearer ${data.access_token}`;
      }
    } catch (err: any) {
      console.log(err.response.data);
    }
  }
  async getRating(ratingBody: Rating): Promise<void | Error> {
    if (!this.subServices) {
      return new Error("This service doesn't have subServices");
    }
    const ratingInfo = this.subServices.rating;
    const body = formatRatingBody(ratingBody, this.serviceName.toLowerCase());
    try {
      const { data } = await axios({
        method: ratingInfo.method as string,
        url: `${this.baseUrl}${ratingInfo.url as string}`,
        headers: this.getHeaders(),
        data: body,
      });
      return data;
    } catch (error: any) {
      return error;
    }
  }
  async getTracking(trackingNumber: number): Promise<void | Error> {
    if (!this.subServices) {
      return new Error("This service doesn't have subServices");
    }
    const trackingInfo = this.subServices.tracking;
    const isPost = trackingInfo.method === "POST";
    let body;
    const url = `${this.baseUrl}${(trackingInfo.url as string).replace(
      "0",
      trackingNumber.toString()
    )}`;
    console.log(url);
    if (isPost) {
      body = formatTrackingBody(trackingNumber);
    }
    try {
      const { data } = await axios({
        method: trackingInfo.method as string,
        url: url,
        data: body,
        headers: this.getHeaders(),
      });
      return data;
    } catch (error) {
      throw error;
    }
  }
  async getPicking(): Promise<void | Error> {
    return new Promise((data) => data);
  }
  async createShipping(data: any): Promise<void | Error> {
    if (!this.subServices) {
      return new Error("This service doesn't have subServices");
    }
    const shippingInfo = this.subServices.shipping;
    console.log(shippingInfo);
    const isPost = shippingInfo.method === "POST";
    let body;
    if (isPost) {
      body = formatShippingBody(data, this.serviceName);
      console.log(body);
    }
    try {
      const { data } = await axios({
        method: shippingInfo.method as string,
        url: `${this.baseUrl}${shippingInfo.url as string}`,
        data: body,
        headers: this.getHeaders(),
      });
      return data;
    } catch (error) {
      throw error;
    }
  }

  async refreshBaseUrl() {
    const baseUrl = await this.checkIfBaseUrlHasChanged();
    if (!baseUrl) return;

    this.baseUrl = baseUrl;
  }
  async checkIfBaseUrlHasChanged() {
    try {
      const rawData = await FileSystem.readFile(
        "./src/data/settings.json",
        "binary"
      );
      const urlMap = JSON.parse(rawData);
      console.log({ name: this.serviceName, url: urlMap[this.serviceName] });
      return urlMap[this.serviceName];
    } catch (e) {
      return null;
    }
  }
}

export class ScrappingService extends Service {
  browser?: Browser;
  page?: Page;
  constructor(serviceData: serviceData) {
    super(serviceData);
    this.init();
  }
  private async init() {
    this.browser = await puppeter.launch({});
    this.page = await this.browser.newPage();
    await this.page.goto(this.baseUrl);
  }
  setSubServices(subServices: any): void {
    this.subServices = subServices;
  }
  async setAuthorization(): Promise<any> {
    return new Error("This service doesn't require authorization");
  }
  async getRating(ratingBody: Rating): Promise<void> {
    const startTime = performance.now();
    if (this.page && this.subServices)
      try {
        let prices: any = [
          {
            serviceName: "Dia Siguiente",
            prices: {
              total: 0,
              subTotal: 0,
            },
            company: "ESTAFETA",
          },
          {
            serviceName: "2 Dias",
            prices: {
              total: 0,
              subTotal: 0,
            },
            company: "ESTAFETA",
          },
          {
            serviceName: "Terrestre",
            prices: {
              total: 0,
              subTotal: 0,
            },
            company: "ESTAFETA",
          },
        ];
        const url = `${this.baseUrl}${this.subServices.rating.url}`;
        await this.page.goto(
          "https://cotizadorsitecorecms.azurewebsites.net/?lang=0"
        );
        await this.page.click("#package");
        await this.page.type(
          "#zipCodeOri",
          ratingBody.originPostalCode.toString()
        );
        await this.page.type(
          "#zipCodeDes",
          ratingBody.destinyPostalCode.toString()
        );
        await this.page.type(
          "#weightPackage",
          ratingBody.packageSize.weight.toString()
        );
        await this.page.type(
          "#highPackage",
          ratingBody.packageSize.height.toString()
        );
        await this.page.type(
          "#longPackage",
          ratingBody.packageSize.length.toString()
        );
        await this.page.type(
          "#widthPackage",
          ratingBody.packageSize.width.toString()
        );
        await this.page.screenshot({ path: "./img.png", type: "png" });
        await this.page.click("#btnEnviarCotiza");
        await this.page.screenshot({ path: "./img.png", type: "png" });
        await this.page.waitForSelector("#wrapResultados");

        prices = await Promise.all(
          prices.map(async (price: any, i: number) => {
            let selector = `div#cost_total_${i}`;
            if (this.page) {
              if ((await this.page.$(selector)) === null) return null;
              price.prices.total = await this.page.$eval(
                selector.toString(),
                (element) => element.textContent
              );
              price.prices.subTotal = await this.page.$eval(
                `table tbody tr:nth-child(4) td:nth-child(${i + 3})`,
                (element) => element.textContent
              );
              return price;
            }
          })
        );
        return prices.filter((e: any) => e !== null);
      } catch (error: any) {
        console.log("salto el catch");
        return error;
      }
  }
  async getTracking(trackingNumber: number): Promise<void> {
    if (this.page && this.subServices) {
      const url = `${this.baseUrl}${this.subServices.tracking.url}`;
      await this.page.goto(url);
      await this.page.type("#GuiaCodigo", trackingNumber.toString());
      await this.page.click("#btnRastrear");
    }
  }
  async getPicking(): Promise<void | Error> {
    return new Error("This service doesn't have this subService");
  }
  async createShipping(): Promise<void | Error> {
    return new Error("This service doesnt't have this subService");
  }
}
type serviceData = {
  baseUrl: string;
  subServices?: subService;
  headers: any;
  serviceName: string;
};

type subService = {
  rating: {
    url: string | string[];
    method: string | string[];
  };
  tracking: {
    url: string | string[];
    method: string | string[];
  };
  picking: {
    url: string | string[];
    method: string | string[];
  };
  shipping: {
    url: string | string[];
    method: string | string[];
  };
};
type parsedBodies = {
  fedex: any;
  dhl: any;
  ups: any;
};
