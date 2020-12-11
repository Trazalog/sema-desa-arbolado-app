export class Endpoint {


    private static _PROTOCOL: string = "https";
    //private static _PROTOCOL: string = "http";

    //private static _HOSTNAME_BACKEND: string = "dev-trazalog.com.ar";
    private static _HOSTNAME_BACKEND: string = "soa.sanjuan.gob.ar";

    private static _PORT_BACKEND: string = "443";
    //private static _PORT_BACKEND: string = "8246";

    private static _TIMEOUT: number = 90000; // in ms 1000ms = 1seg.


    /* ENDPOINTS
    * ==========
    */

    private static _URL_LOGIN: string = "/censarb/api/token";

    private static _URL_GET_USER_PROFILE: string = "/censarb/api/arbolado/api/ds/v1.0.0/perfil";

    private static _URL_UPDATE_USER_PROFILE: string = "/censarb/api/arbolado/api/ds/v1.0.0/perfil";

    private static _URL_GET_USER_TREE: string = "/censarb/api/arbolado/api/v1.0.0/area";

    private static _URL_INSTANCE_FORM: string = "/censarb/api/arbolado/api/ds/v1.0.0/request_box";

    private static _URL_PUT_FORM: string = "/censarb/api/arbolado/api/ds/v1.0.0/_put_formulario_batch_req";

    private static _URL_POST_FORM_OFFLINE: string = "/censarb/api/arbolado/api/v1.0.0/arbol";

    private static _URL_POST_NEW_TREE: string = "/censarb/api/arbolado/api/ds/v1.0.0/arbol";

    private static _URL_GET_TREE_DATA: string = "/censarb/api/arbolado/api/ds/v1.0.0/arbol";

    private static _URL_GET_FORM: string = "/censarb/api/arbolado/api/ds/v1.0.0/formulario/";

    private static _URL_GET_FORM_TEMPLATE: string = "/censarb/api/arbolado/api/ds/v1.0.0/formulario/template/2";





    static get PROTOCOL(): string {
        return this._PROTOCOL;
    }

    static set PROTOCOL(value: string) {
        this._PROTOCOL = value;
    }


    static get HOSTNAME_BACKEND(): string {
        return this._HOSTNAME_BACKEND;
    }

    static set HOSTNAME_BACKEND(value: string) {
        this._HOSTNAME_BACKEND = value;
    }

    static get PORT_BACKEND(): string {
        return this._PORT_BACKEND;
    }

    static set PORT_BACKEND(value: string) {
        this._PORT_BACKEND = value;
    }

    static get URL_LOGIN(): string {
        return this._URL_LOGIN;
    }

    static set URL_LOGIN(value: string) {
        this._URL_LOGIN = value;
    }

    static get URL_GET_USER_PROFILE(): string {
        return this._URL_GET_USER_PROFILE;
    }

    static set URL_GET_USER_PROFILE(value: string) {
        this._URL_GET_USER_PROFILE = value;
    }

    static get URL_UPDATE_USER_PROFILE(): string {
        return this._URL_UPDATE_USER_PROFILE;
    }

    static set URL_UPDATE_USER_PROFILE(value: string) {
        this._URL_UPDATE_USER_PROFILE = value;
    }


    static get URL_GET_USER_TREE(): string {
        return this._URL_GET_USER_TREE;
    }

    static set URL_GET_USER_TREE(value: string) {
        this._URL_GET_USER_TREE = value;
    }


    static get TIMEOUT(): number {
        return this._TIMEOUT;
    }

    static set TIMEOUT(value: number) {
        this._TIMEOUT = value;
    }

    static get URL_INSTANCE_FORM():string{
        return this._URL_INSTANCE_FORM;
    }

    static set URL_INSTANCE_FORM(value){
        this._URL_INSTANCE_FORM=value;
    }

    static get URL_GET_FORM(): string {
        return this._URL_GET_FORM;
    }

    static set URL_GET_FORM(value: string) {
        this._URL_GET_FORM = value;
    }


    static get URL_PUT_FORM(): string {
        return this._URL_PUT_FORM;
    }

    static set URL_PUT_FORM(value: string) {
        this._URL_PUT_FORM = value;
    }


    static get URL_POST_NEW_TREE(): string {
        return this._URL_POST_NEW_TREE;
    }

    static set URL_POST_NEW_TREE(value: string) {
        this._URL_POST_NEW_TREE = value;
    }

    static get URL_GET_TREE_DATA(): string {
        return this._URL_GET_TREE_DATA;
    }

    static set URL_GET_TREE_DATA(value: string) {
        this._URL_GET_TREE_DATA = value;
    }


    static get URL_GET_FORM_TEMPLATE(): string {
        return this._URL_GET_FORM_TEMPLATE;
    }

    static set URL_GET_FORM_TEMPLATE(value: string) {
        this._URL_GET_FORM_TEMPLATE = value;
    }


    static get URL_POST_FORM_OFFLINE(): string {
        return this._URL_POST_FORM_OFFLINE;
    }

    static set URL_POST_FORM_OFFLINE(value: string) {
        this._URL_POST_FORM_OFFLINE = value;
    }
}
