import * as store from "store2";


export class Session {


    public static create(username: string, access_token: string,  refresh_token: string, scope: string, token_type: string, expires_in: string) {

        store.set("username", username);
        store.set("access_token", access_token);
        store.set("refresh_token", refresh_token);
        store.set("scope", scope);
        store.set("token_type", token_type);
        store.set("expires_in", expires_in);
    }

    public static invalidate() {
        store.remove("username");
        store.remove("access_token");
        store.remove("refresh_token");
        store.remove("scope");
        store.remove("token_type");
        store.remove("expires_in");
        store.remove("get_tree_response");
        //store.clearAll();
    }


    public static exists() {

        return store.size() === 8 &&
            store.has("username") &&
            store.has("access_token") &&
            store.has("refresh_token") &&
            store.has("scope") &&
            store.has("token_type") &&
            store.has("expires_in") &&
            store.has("get_tree_response")
    }


    public static getSessionUsername(){

        return store.get("username");
    }

    public static getAccessToken() {

        return store.get("access_token");
    }
}
