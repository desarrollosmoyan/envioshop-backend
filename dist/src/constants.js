"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PAQUETEEXPRESSSERVICE = exports.PAQUETEEXPRESS = exports.ESTAFETA = exports.REDPACK = exports.UPS = exports.DHL = exports.FEDEX = void 0;
const settings_json_1 = require("./data/settings.json");
exports.FEDEX = {
    baseUrl: settings_json_1.FEDEX,
    serviceName: 'FEDEX',
    headers: {
        'Content-Type': 'application/json',
    },
    subServices: {
        rating: {
            url: '/rate/v1/rates/quotes',
            method: 'POST',
        },
        tracking: {
            url: '/track/v1/trackingnumbers',
            method: 'POST',
        },
        picking: {
            url: '',
            method: '',
        },
        shipping: {
            url: ['/ship/v1/shipments', '/ship/v1/shipments/cancel'],
            method: ['POST', 'DELETE'],
        },
    },
};
exports.DHL = {
    baseUrl: settings_json_1.DHL,
    serviceName: 'DHL',
    headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${Buffer.from(`${process.env.DHL_USERNAME}:${process.env.DHL_PASSWORD}`).toString('base64')}`,
    },
    subServices: {
        rating: {
            url: '/rates',
            method: 'POST',
        },
        tracking: {
            url: '/shipments/0/tracking',
            method: 'GET',
        },
        picking: {
            url: '/pickups',
            method: '',
        },
        shipping: {
            url: '/shipments',
            method: 'POST',
        },
    },
};
exports.UPS = {
    baseUrl: settings_json_1.UPS,
    serviceName: 'UPS',
    headers: {
        'Content-Type': 'application/json',
        AccessLicenseNumber: `${process.env.ACCESS_LICENSE_NUMBER}`,
    },
    subServices: {
        rating: {
            url: '/ship/v1/rating/Rate',
            method: 'POST',
        },
        tracking: {
            url: '/track/v1/details/0',
            method: 'GET',
        },
        picking: {
            url: '/ship/v1/shipments',
            method: '',
        },
        shipping: {
            url: '',
            method: '',
        },
    },
};
exports.REDPACK = {
    baseUrl: 'https://',
    serviceName: 'REDPACK',
    headers: {
        'Content-Type': 'application/json',
    },
    subServices: {
        rating: {
            url: 'apiqa2.redpack.com.mx:5800/redpack/nationalQuote',
            method: 'GET',
        },
        tracking: {
            url: 'apiqa.redpack.com.mx:5400/redpack/trackingByNumber',
            method: 'GET',
        },
        picking: {
            url: '/pickups',
            method: '',
        },
        shipping: {
            url: 'apiqa.redpack.com.mx:5600/redpack/automatic-documentation',
            method: 'POST',
        },
    },
};
exports.ESTAFETA = {
    baseUrl: 'https://www.estafeta.com/',
    serviceName: 'ESTAFETA',
    headers: {
        'Content-Type': 'application/json',
    },
    subServices: {
        rating: {
            url: '/Herramientas/Cotizar-un-envio',
            method: '',
        },
        tracking: {
            url: '/Herramientas/Rastreo',
            method: '',
        },
        picking: {
            url: '',
            method: '',
        },
        shipping: {
            url: '',
            method: '',
        },
    },
};
exports.PAQUETEEXPRESS = {
    baseUrl: 'https://www.paquetexpress.com.mx/servicios',
    serviceName: 'PAQUETEEXPRESS',
    headers: {
        'Content-Type': 'application/json',
    },
    subServices: {
        rating: {
            url: '',
            method: '',
        },
        tracking: {
            url: '',
            method: '',
        },
        picking: {
            url: '',
            method: '',
        },
        shipping: {
            url: '',
            method: '',
        },
    },
};
exports.PAQUETEEXPRESSSERVICE = {
    baseUrl: 'https://cc.paquetexpress.com.mx',
    serviceName: 'PAQUETEEXPRESS',
    headers: {
        'Content-Type': 'application/json',
    },
    subServices: {
        rating: {
            url: '/WsQuotePaquetexpress/api/apiQuoter/v2/getQuotation?source=WEBPAGE',
            method: 'POST',
        },
        tracking: {
            url: '',
            method: '',
        },
        picking: {
            url: '',
            method: '',
        },
        shipping: {
            url: '',
            method: '',
        },
    },
};
