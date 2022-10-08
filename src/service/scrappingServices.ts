import { Service } from "./service";
import puppeteer, { Browser, Page } from "puppeteer";

export class ScrappingService2 extends Service {
  browser?: Browser;
  page?: Page;
  constructor(serviceData: serviceData) {
    super(serviceData);
    this.init();
  }
  private async init() {
    this.browser = await puppeteer.launch({
      executablePath: "/usr/bin/chromium-browser",
    });
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
    if (this.page && this.subServices)
      try {
        await this.page.goto(this.baseUrl);
        const buttonAccept = await this.page.$(
          "button.BtnBlue.px-10.py-2.font-bold"
        );
        if (buttonAccept) {
          await this.page.click("button.BtnBlue.px-10.py-2.font-bold");
        }

        await this.page.click(
          "button.BtnRed.mt-4.px-10.py-4.font-bold.text-2xl.tracking-wide.uppercase"
        );

        await this.page.waitForSelector("div.InputPostalCode");
        await this.page.click("div.InputPostalCode > div > span");
        await this.page.type(
          "#postalcodes-suburb",
          ratingBody.originPostalCode.toString()
        );
        await this.page.waitForSelector("#postalcodes-cities");
        await this.page.click("#postalcodes-cities");
        await this.page.keyboard.press("ArrowDown");
        await this.page.keyboard.press("Enter");
        const buttonsContainer = await this.page.$(
          "div.bg-white.shadow-lg.pt-10.pb-10.px-14.absolute.z-50 > div.mb-10.w-full.flex"
        );
        //buttonsContainer.chi;
        console.log(buttonsContainer);
        const destinationButton = await this.page.$("span.w-1/2:nth-child(2)");
        if (!destinationButton) {
          throw new Error("Pepe");
        }
        await destinationButton.click();
        await this.page.screenshot({ path: "example.png" });
      } catch (error: any) {
        console.log(error);
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
