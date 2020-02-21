var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import axios from "axios";
import { Endpoint } from "./Endpoint";
import * as store from "store2";
var uuidv4 = require('uuid/v4');
var User = /** @class */ (function () {
    function User(full_name, email, phone, picture) {
        this._full_name = full_name;
        this._email = email;
        this._phone = phone;
        this._picture = picture;
    }
    /*** Sign in ***/
    User.login = function (username, password) {
        return __awaiter(this, void 0, void 0, function () {
            var url, params, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = Endpoint.PROTOCOL + "://" + Endpoint.HOSTNAME_BACKEND + ":" + Endpoint.PORT_BACKEND + Endpoint.URL_LOGIN;
                        params = {
                            grant_type: 'password',
                            username: username,
                            password: password
                        };
                        data = Object.entries(params)
                            .map(function (_a) {
                            var key = _a[0], val = _a[1];
                            return key + "=" + encodeURIComponent(val);
                        })
                            .join('&');
                        return [4 /*yield*/, axios({
                                method: "POST",
                                url: url,
                                timeout: Endpoint.TIMEOUT,
                                withCredentials: false,
                                data: data,
                                headers: {
                                    "Content-Type": "application/x-www-form-urlencoded",
                                    //"Authorization": "Basic VW9GckRZbWxRQU5jNzhEZGJVWTNvcGZ4aWZ3YTppbU1ycUJlZDNIRW01MDU2aXZsd2ZFOTl6TjRh"
                                    "Authorization": "Basic M0t4SUtfV2tQQUtSUGlzQWczaXdIRnlqZm13YTpsNWs5YlYzYTZpZnBqMnNMQ2tmc0JXWVpzVThh"
                                }
                            })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /*** get profile ***/
    User.getProfile = function () {
        return __awaiter(this, void 0, void 0, function () {
            var url;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = Endpoint.PROTOCOL + "://" + Endpoint.HOSTNAME_BACKEND + ":" + Endpoint.PORT_BACKEND + Endpoint.URL_GET_USER_PROFILE + "/" + encodeURIComponent(store.get("username"));
                        return [4 /*yield*/, axios({
                                method: "GET",
                                url: url,
                                timeout: Endpoint.TIMEOUT,
                                withCredentials: false,
                                headers: {
                                    'Authorization': store.get("token_type") + ' ' + store.get('access_token'),
                                    'Content-Type': 'application/json'
                                }
                            })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /*** update profile ***/
    User.prototype.updateProfile = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var url;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = Endpoint.PROTOCOL + "://" + Endpoint.HOSTNAME_BACKEND + ":" + Endpoint.PORT_BACKEND + Endpoint.URL_UPDATE_USER_PROFILE;
                        return [4 /*yield*/, axios({
                                method: "PUT",
                                url: url,
                                timeout: Endpoint.TIMEOUT,
                                withCredentials: false,
                                data: data,
                                headers: {
                                    'Authorization': store.get("token_type") + ' ' + store.get('access_token'),
                                    'Content-Type': 'application/json'
                                }
                            })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /*** get user areas ***/
    User.getArea = function () {
        return __awaiter(this, void 0, void 0, function () {
            var url;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = Endpoint.PROTOCOL + "://" + Endpoint.HOSTNAME_BACKEND + ":" + Endpoint.PORT_BACKEND + Endpoint.URL_GET_USER_TREE + "/" + encodeURIComponent(store.get("username"));
                        return [4 /*yield*/, axios({
                                method: "GET",
                                url: url,
                                timeout: Endpoint.TIMEOUT,
                                withCredentials: false,
                                headers: {
                                    'Accept': 'application/json',
                                    'Content-Type': 'application/json',
                                    'Authorization': store.get("token_type") + ' ' + store.get('access_token')
                                }
                            })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /*** get user squares ***/
    User.getSquare = function () {
        return __awaiter(this, void 0, void 0, function () {
            var url;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = Endpoint.PROTOCOL + "://" + Endpoint.HOSTNAME_BACKEND + ":" + Endpoint.PORT_BACKEND + Endpoint.URL_GET_USER_TREE + "/" + encodeURIComponent(store.get("username"));
                        return [4 /*yield*/, axios({
                                method: "GET",
                                url: url,
                                timeout: Endpoint.TIMEOUT,
                                withCredentials: false,
                                headers: {
                                    'Accept': 'application/json',
                                    'Authorization': store.get("token_type") + ' ' + store.get('access_token')
                                }
                            })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /*** get user trees ***/
    User.getTree = function () {
        return __awaiter(this, void 0, void 0, function () {
            var url;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = Endpoint.PROTOCOL + "://" + Endpoint.HOSTNAME_BACKEND + ":" + Endpoint.PORT_BACKEND + Endpoint.URL_GET_USER_TREE + "/" + encodeURIComponent(store.get("username"));
                        return [4 /*yield*/, axios({
                                method: "GET",
                                url: url,
                                timeout: Endpoint.TIMEOUT,
                                withCredentials: false,
                                headers: {
                                    'Accept': 'application/json',
                                    'Authorization': store.get("token_type") + ' ' + store.get('access_token')
                                }
                            })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /*** get user trees ***/
    User.getAllStreets = function () {
        return __awaiter(this, void 0, void 0, function () {
            var url;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = Endpoint.PROTOCOL + "://" + Endpoint.HOSTNAME_BACKEND + ":" + Endpoint.PORT_BACKEND + Endpoint.URL_GET_USER_TREE + "/" + encodeURIComponent(store.get("username"));
                        return [4 /*yield*/, axios({
                                method: "GET",
                                url: url,
                                timeout: Endpoint.TIMEOUT,
                                withCredentials: false,
                                headers: {
                                    'Accept': 'application/json',
                                    'Authorization': store.get("token_type") + ' ' + store.get('access_token')
                                }
                            })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /*** get user formulario dynamic ***/
    User.getDynamicForm = function () {
        return __awaiter(this, void 0, void 0, function () {
            var url;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = Endpoint.PROTOCOL + "://" + Endpoint.HOSTNAME_BACKEND + ":" + Endpoint.PORT_BACKEND + Endpoint.URL_GET_FORM + "/1";
                        return [4 /*yield*/, axios({
                                method: "GET",
                                url: url,
                                timeout: Endpoint.TIMEOUT,
                                withCredentials: false,
                                headers: {
                                    'Accept': 'application/json',
                                    'Authorization': store.get("token_type") + ' ' + store.get('access_token')
                                }
                            })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    Object.defineProperty(User.prototype, "username", {
        get: function () {
            return this._username;
        },
        set: function (value) {
            this._username = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(User.prototype, "full_name", {
        get: function () {
            return this._full_name;
        },
        set: function (value) {
            this._full_name = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(User.prototype, "password", {
        get: function () {
            return this._password;
        },
        set: function (value) {
            this._password = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(User.prototype, "email", {
        get: function () {
            return this._email;
        },
        set: function (value) {
            this._email = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(User.prototype, "phone", {
        get: function () {
            return this._phone;
        },
        set: function (value) {
            this._phone = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(User.prototype, "picture", {
        get: function () {
            return this._picture;
        },
        set: function (value) {
            this._picture = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(User.prototype, "tree", {
        get: function () {
            return this._tree;
        },
        set: function (value) {
            this._tree = value;
        },
        enumerable: true,
        configurable: true
    });
    return User;
}());
export { User };
//# sourceMappingURL=User.js.map