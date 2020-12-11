var Endpoint = /** @class */ (function () {
    function Endpoint() {
    }
    Object.defineProperty(Endpoint, "PROTOCOL", {
        get: function () {
            return this._PROTOCOL;
        },
        set: function (value) {
            this._PROTOCOL = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Endpoint, "HOSTNAME_BACKEND", {
        get: function () {
            return this._HOSTNAME_BACKEND;
        },
        set: function (value) {
            this._HOSTNAME_BACKEND = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Endpoint, "PORT_BACKEND", {
        get: function () {
            return this._PORT_BACKEND;
        },
        set: function (value) {
            this._PORT_BACKEND = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Endpoint, "URL_LOGIN", {
        get: function () {
            return this._URL_LOGIN;
        },
        set: function (value) {
            this._URL_LOGIN = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Endpoint, "URL_GET_USER_PROFILE", {
        get: function () {
            return this._URL_GET_USER_PROFILE;
        },
        set: function (value) {
            this._URL_GET_USER_PROFILE = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Endpoint, "URL_UPDATE_USER_PROFILE", {
        get: function () {
            return this._URL_UPDATE_USER_PROFILE;
        },
        set: function (value) {
            this._URL_UPDATE_USER_PROFILE = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Endpoint, "URL_GET_USER_TREE", {
        get: function () {
            return this._URL_GET_USER_TREE;
        },
        set: function (value) {
            this._URL_GET_USER_TREE = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Endpoint, "TIMEOUT", {
        get: function () {
            return this._TIMEOUT;
        },
        set: function (value) {
            this._TIMEOUT = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Endpoint, "URL_INSTANCE_FORM", {
        get: function () {
            return this._URL_INSTANCE_FORM;
        },
        set: function (value) {
            this._URL_INSTANCE_FORM = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Endpoint, "URL_GET_FORM", {
        get: function () {
            return this._URL_GET_FORM;
        },
        set: function (value) {
            this._URL_GET_FORM = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Endpoint, "URL_PUT_FORM", {
        get: function () {
            return this._URL_PUT_FORM;
        },
        set: function (value) {
            this._URL_PUT_FORM = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Endpoint, "URL_POST_NEW_TREE", {
        get: function () {
            return this._URL_POST_NEW_TREE;
        },
        set: function (value) {
            this._URL_POST_NEW_TREE = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Endpoint, "URL_GET_TREE_DATA", {
        get: function () {
            return this._URL_GET_TREE_DATA;
        },
        set: function (value) {
            this._URL_GET_TREE_DATA = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Endpoint, "URL_GET_FORM_TEMPLATE", {
        get: function () {
            return this._URL_GET_FORM_TEMPLATE;
        },
        set: function (value) {
            this._URL_GET_FORM_TEMPLATE = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Endpoint, "URL_POST_FORM_OFFLINE", {
        get: function () {
            return this._URL_POST_FORM_OFFLINE;
        },
        set: function (value) {
            this._URL_POST_FORM_OFFLINE = value;
        },
        enumerable: true,
        configurable: true
    });
    Endpoint._PROTOCOL = "https";
    //private static _PROTOCOL: string = "http";
    //private static _HOSTNAME_BACKEND: string = "dev-trazalog.com.ar";
    Endpoint._HOSTNAME_BACKEND = "soa.sanjuan.gob.ar";
    Endpoint._PORT_BACKEND = "443";
    //private static _PORT_BACKEND: string = "8246";
    Endpoint._TIMEOUT = 90000; // in ms 1000ms = 1seg.
    /* ENDPOINTS
    * ==========
    */
    Endpoint._URL_LOGIN = "/censarb/api/token";
    Endpoint._URL_GET_USER_PROFILE = "/censarb/api/arbolado/api/ds/v1.0.0/perfil";
    Endpoint._URL_UPDATE_USER_PROFILE = "/censarb/api/arbolado/api/ds/v1.0.0/perfil";
    Endpoint._URL_GET_USER_TREE = "/censarb/api/arbolado/api/v1.0.0/area";
    Endpoint._URL_INSTANCE_FORM = "/censarb/api/arbolado/api/ds/v1.0.0/request_box";
    Endpoint._URL_PUT_FORM = "/censarb/api/arbolado/api/ds/v1.0.0/_put_formulario_batch_req";
    Endpoint._URL_POST_FORM_OFFLINE = "/censarb/api/arbolado/api/v1.0.0/arbol";
    Endpoint._URL_POST_NEW_TREE = "/censarb/api/arbolado/api/ds/v1.0.0/arbol";
    Endpoint._URL_GET_TREE_DATA = "/censarb/api/arbolado/api/ds/v1.0.0/arbol";
    Endpoint._URL_GET_FORM = "/censarb/api/arbolado/api/ds/v1.0.0/formulario/";
    Endpoint._URL_GET_FORM_TEMPLATE = "/censarb/api/arbolado/api/ds/v1.0.0/formulario/template/2";
    return Endpoint;
}());
export { Endpoint };
//# sourceMappingURL=Endpoint.js.map