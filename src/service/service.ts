import axios from "axios";
import {
  formatRatingBody,
  formatTrackingBody,
  formatShippingBody,
} from "../utils/utils";
import puppeter, { Browser, Page } from "puppeteer-core";
import qs from "qs";

abstract class Service {
  public baseUrl: string;
  public serviceName: string;
  public subServices?: subService;
  public headers: any;
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
  async getAuthorization() {
    return this.headers["Authorization"];
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
      } else if (this.serviceName === "REDPACK") {
        console.log("entro");
        const body = qs.stringify({
          client_secret: `${process.env.CLIENT_SECRET_REDPACK}`,
          client_id: `${process.env.CLIENT_ID_REDPACK}`,
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
          },
        });
        console.log("pepe");
        console.log({ redpack: data });
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
      await this.setAuthorization();
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
    if (isPost) {
      body = formatTrackingBody(trackingNumber);
    }
    try {
      const { data } = await axios({
        method: trackingInfo.method as string,
        url: trackingInfo.url as string,
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
    const isPost = shippingInfo.method === "POST";
    let body;
    if (isPost) {
      body = formatShippingBody(data);
    }
    try {
      const { data } = await axios({
        method: shippingInfo.method as string,
        url: shippingInfo.url as string,
        data: body,
      });
      return data;
    } catch (error) {
      throw error;
    }
    return new Promise((data) => data);
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
    this.browser = await puppeter.launch({
      executablePath: "/usr/bin/chromium-browser",
    });
    this.page = await this.browser.newPage();
    await this.page.goto(this.baseUrl);
    console.log(this.baseUrl);
  }
  setSubServices(subServices: any): void {
    this.subServices = subServices;
  }
  async setAuthorization(): Promise<any> {
    return new Error("This service doesn't require authorization");
  }
  async getRating(ratingBody: Rating): Promise<void> {
    if (this.page && this.subServices)
      try {
        let prices: any = [
          {
            serviceName: "Dia Siguiente",
            price: 0,
            company: "ESTAFETA",
          },
          {
            serviceName: "2 Dias",
            price: 0,
            company: "ESTAFETA",
          },
          {
            serviceName: "Terrestre",
            price: 0,
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
        await this.page.click("#btnEnviarCotiza");
        await this.page.screenshot({ path: "./img.png", type: "png" });
        await this.page.waitForSelector("#wrapResultados");

        prices = await Promise.all(
          prices.map(async (price: any, i: number) => {
            let selector = `div#cost_total_${i}`;
            if (this.page)
              price.price = await this.page.$eval(
                selector.toString(),
                (element) => element.textContent
              );
            return price;
          })
        );
        return prices;
      } catch (error: any) {
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
