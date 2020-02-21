import * as store from "store2";
var Session = /** @class */ (function () {
    function Session() {
    }
    Session.create = function (username, access_token, refresh_token, scope, token_type, expires_in) {
        store.set("username", username);
        store.set("access_token", access_token);
        store.set("refresh_token", refresh_token);
        store.set("scope", scope);
        store.set("token_type", token_type);
        store.set("expires_in", expires_in);
    };
    Session.invalidate = function () {
        store.remove("username");
        store.remove("access_token");
        store.remove("refresh_token");
        store.remove("scope");
        store.remove("token_type");
        store.remove("expires_in");
        store.remove("get_tree_response");
        //store.clearAll();
    };
    Session.exists = function () {
        return store.size() === 8 &&
            store.has("username") &&
            store.has("access_token") &&
            store.has("refresh_token") &&
            store.has("scope") &&
            store.has("token_type") &&
            store.has("expires_in") &&
            store.has("get_tree_response");
    };
    Session.getSessionUsername = function () {
        return store.get("username");
    };
    Session.getAccessToken = function () {
        return store.get("access_token");
    };
    return Session;
}());
export { Session };
//# sourceMappingURL=Session.js.map