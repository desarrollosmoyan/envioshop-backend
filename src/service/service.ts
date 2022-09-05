import axios from "axios";
import qs from "qs";
import { formatRatingBody } from "../utils/utils";

export default class Service {
  public baseUrl: string;
  private token: string | undefined;
  public subServices: subServices = {
    rating: { url: "" },
    picking: { url: "" },
    shipping: { url: "" },
    tracking: { url: "" },
  };
  private headers: any;
  public serviceName: string;
  constructor(
    baseUrl: string,
    headers: any,
    subServices: subServices,
    serviceName: string
  ) {
    this.baseUrl = baseUrl;
    this.headers = headers;
    this.serviceName = serviceName;
    this.subServices = subServices;
  }
  async getRating(ratingBody: Rating) {
    try {
      const parsedBodies: parsedBodies = await formatRatingBody(ratingBody);
      const body =
        parsedBodies[this.serviceName.toLowerCase() as keyof parsedBodies];
      const { data, status } = await axios({
        method: "POST",
        data: body,
        headers: {
          ...this.headers,
        },
        url: `${this.baseUrl}${this.subServices.rating.url as string}`,
      });
      console.log(data.errors);
      return data;
    } catch (error) {
      return error;
    }
  }
  async setAuthorizationToken() {
    try {
      if (this.serviceName === "Fedex") {
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
      } else if (this.serviceName === "DHL") {
        this.headers["Authorization"] = `Basic ${Buffer.from(
          `${process.env.DHL_USERNAME}:${process.env.DHL_PASSWORD}`
        ).toString("base64")}`;
      } else if (this.serviceName === "UPS") {
        this.headers[
          "AccessLicenseNumber"
        ] = `${process.env.ACCESS_LICENSE_NUMBER}`;
      }
    } catch (err) {
      throw err;
    }
  }
  getAuthorizationToken() {
    switch (this.serviceName) {
      case "Fedex":
        return `Bearer ${this.token}`;
      case "DHL":
        return `Basic ${this.token}`;
      case "UPS":
        return `${this.token}`;
    }
    return this.token;
  }
  async getTracking(trackingBody: Tracking) {
    try {
      const response = await axios({
        method: "POST",
      });
    } catch (error) {}
  }
  setSubServices(subServices: subServices) {
    this.subServices = subServices;
  }
  setSubServicesURL(subServicesUrls: subServicesUrls) {
    Object.keys(this.subServices).map((key: string) => {
      this.subServices[key as keyof subServices].url =
        subServicesUrls[key as keyof subServicesUrls];
    });
  }
}

type subServices = {
  rating: {
    url: string | string[];
    headers?: Headers;
  };
  tracking: {
    url: string | string[];
    headers?: Headers;
  };
  shipping: {
    url: string | string[];
    headers?: Headers;
  };
  picking: {
    url: string | string[];
    headers?: Headers;
  };
};
type subServicesUrls = {
  rating: string;
  tracking: string | string[];
  picking: string | string[];
  shipping: string | string[];
};
type parsedBodies = {
  fedex: any;
  dhl: any;
  ups: any;
};
