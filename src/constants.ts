export const FEDEX = {
  baseUrl: "https://apis.fedex.com",
  serviceName: "FEDEX",
  headers: {
    "Content-Type": "application/json",
  },
  subServices: {
    rating: {
      url: "/rate/v1/rates/quotes",
      method: "POST",
    },
    tracking: {
      url: "/track/v1/trackingnumbers",
      method: "POST",
    },
    picking: {
      url: "",
      method: "",
    },
    shipping: {
      url: ["/ship/v1/shipments", "/ship/v1/shipments/cancel"],
      method: ["POST", "DELETE"],
    },
  },
};

export const DHL = {
  baseUrl: "https://express.api.dhl.com/mydhlapi/test",
  serviceName: "DHL",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Basic ${Buffer.from(
      `${process.env.DHL_USERNAME}:${process.env.DHL_PASSWORD}`
    ).toString("base64")}`,
  },
  subServices: {
    rating: {
      url: "/rates",
      method: "POST",
    },
    tracking: {
      url: "/shipments/0/tracking",
      method: "GET",
    },
    picking: {
      url: "/pickups",
      method: "",
    },
    shipping: {
      url: "/shipments",
      method: "POST",
    },
  },
};

export const UPS = {
  baseUrl: "https://wwwcie.ups.com",
  serviceName: "UPS",
  headers: {
    "Content-Type": "application/json",
    AccessLicenseNumber: `${process.env.ACCESS_LICENSE_NUMBER}`,
  },
  subServices: {
    rating: {
      url: "/ship/v1/rating/Rate",
      method: "POST",
    },
    tracking: {
      url: "/track/v1/details/0",
      method: "GET",
    },
    picking: {
      url: "",
      method: "",
    },
    shipping: {
      url: "",
      method: "",
    },
  },
};

export const REDPACK = {
  baseUrl: "https://",
  serviceName: "REDPACK",
  headers: {
    "Content-Type": "application/json",
  },
  subServices: {
    rating: {
      url: "apiqa2.redpack.com.mx:5800/redpack/nationalQuote",
      method: "GET",
    },
    tracking: {
      url: "apiqa.redpack.com.mx:5400/redpack/trackingByNumber",
      method: "GET",
    },
    picking: {
      url: "/pickups",
      method: "",
    },
    shipping: {
      url: "/shipments",
      method: "",
    },
  },
};

export const ESTAFETA = {
  baseUrl: "https://www.estafeta.com/",
  serviceName: "ESTAFETA",
  headers: {
    "Content-Type": "application/json",
  },
  subServices: {
    rating: {
      url: "/Herramientas/Cotizar-un-envio",
      method: "",
    },
    tracking: {
      url: "/Herramientas/Rastreo",
      method: "",
    },
    picking: {
      url: "",
      method: "",
    },
    shipping: {
      url: "",
      method: "",
    },
  },
};

export const PAQUETEEXPRESS = {
  baseUrl: "https://www.paquetexpress.com.mx/servicios",
  serviceName: "PAQUETEEXPRESS",
  headers: {
    "Content-Type": "application/json",
  },
  subServices: {
    rating: {
      url: "",
      method: "",
    },
    tracking: {
      url: "",
      method: "",
    },
    picking: {
      url: "",
      method: "",
    },
    shipping: {
      url: "",
      method: "",
    },
  },
};

export const PAQUETEEXPRESSSERVICE = {
  baseUrl: "https://cc.paquetexpress.com.mx",
  serviceName: "PAQUETEEXPRESS",
  headers: {
    "Content-Type": "application/json",
  },
  subServices: {
    rating: {
      url: "/WsQuotePaquetexpress/api/apiQuoter/v2/getQuotation?source=WEBPAGE",
      method: "POST",
    },
    tracking: {
      url: "",
      method: "",
    },
    picking: {
      url: "",
      method: "",
    },
    shipping: {
      url: "",
      method: "",
    },
  },
};
