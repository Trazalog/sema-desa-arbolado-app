import axios from "axios";

import {Session} from "./Session";

import {Endpoint} from "./Endpoint";
import {Tree} from "./Tree";
import * as store from "store2";
import {Connectivity} from "./Connectivity";

const uuidv4 = require('uuid/v4');


export class User {

    private _username: string;
    private _full_name: string;
    private _password: string;
    private _email: string;
    private _phone: string;
    private _picture: string;
    private _tree: [Tree];


    /*** Sign in ***/
    public static async login(username: string, password: string){

        let url: string = Endpoint.PROTOCOL + "://" + Endpoint.HOSTNAME_BACKEND + ":" + Endpoint.PORT_BACKEND + Endpoint.URL_LOGIN;

        const params = {
            grant_type: 'password',
            username: username,
            password: password
        };

        const data = Object.entries(params)
            .map(([key, val]) => `${key}=${encodeURIComponent(val)}`)
            .join('&');

        return await axios({
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
        });
    }

    /*** get profile ***/
    public static async getProfile(){

        let url: string = Endpoint.PROTOCOL + "://" + Endpoint.HOSTNAME_BACKEND + ":" + Endpoint.PORT_BACKEND + Endpoint.URL_GET_USER_PROFILE + "/" + encodeURIComponent(store.get("username"));

        return await axios({
            method: "GET",
            url: url,
            timeout: Endpoint.TIMEOUT,
            withCredentials: false,
            headers: {
                'Authorization': store.get("token_type") + ' ' + store.get('access_token'),
                'Content-Type': 'application/json'
            }
        });
    }

    /*** update profile ***/
    public async updateProfile(data){

        let url: string = Endpoint.PROTOCOL + "://" + Endpoint.HOSTNAME_BACKEND + ":" + Endpoint.PORT_BACKEND + Endpoint.URL_UPDATE_USER_PROFILE;

        return await axios({
            method: "PUT",
            url: url,
            timeout: Endpoint.TIMEOUT,
            withCredentials: false,
            data: data,
            headers: {
                'Authorization': store.get("token_type") + ' ' + store.get('access_token'),
                'Content-Type': 'application/json'
            }
        });
    }


    /*** get user areas ***/
    public static async getArea(){

        let url: string = Endpoint.PROTOCOL + "://" + Endpoint.HOSTNAME_BACKEND + ":" + Endpoint.PORT_BACKEND + Endpoint.URL_GET_USER_TREE + "/" + encodeURIComponent(store.get("username"));

        return await axios({
            method: "GET",
            url: url,
            timeout: Endpoint.TIMEOUT,
            withCredentials: false,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': store.get("token_type") + ' ' + store.get('access_token')
            }
        });
    }


    /*** get user squares ***/
    public static async getSquare(){

        let url: string = Endpoint.PROTOCOL + "://" + Endpoint.HOSTNAME_BACKEND + ":" + Endpoint.PORT_BACKEND + Endpoint.URL_GET_USER_TREE + "/" + encodeURIComponent(store.get("username"));

        return await axios({
            method: "GET",
            url: url,
            timeout: Endpoint.TIMEOUT,
            withCredentials: false,
            headers: {
                'Accept': 'application/json',
                'Authorization': store.get("token_type") + ' ' + store.get('access_token')
            }
        });
    }


    /*** get user trees ***/
    public static async getTree(){

        let url: string = Endpoint.PROTOCOL + "://" + Endpoint.HOSTNAME_BACKEND + ":" + Endpoint.PORT_BACKEND + Endpoint.URL_GET_USER_TREE + "/" + encodeURIComponent(store.get("username"));

        return await axios({
            method: "GET",
            url: url,
            timeout: Endpoint.TIMEOUT,
            withCredentials: false,
            headers: {
                'Accept': 'application/json',
                'Authorization': store.get("token_type") + ' ' + store.get('access_token')
            }
        });
    }


    /*** get user trees ***/
    public static async getAllStreets(){

        let url: string = Endpoint.PROTOCOL + "://" + Endpoint.HOSTNAME_BACKEND + ":" + Endpoint.PORT_BACKEND + Endpoint.URL_GET_USER_TREE + "/" + encodeURIComponent(store.get("username"));

        return await axios({
            method: "GET",
            url: url,
            timeout: Endpoint.TIMEOUT,
            withCredentials: false,
            headers: {
                'Accept': 'application/json',
                'Authorization': store.get("token_type") + ' ' + store.get('access_token')
            }
        });
    }

    /*** get user formulario dynamic ***/
    public static async getDynamicForm(){

        let url: string = Endpoint.PROTOCOL + "://" + Endpoint.HOSTNAME_BACKEND + ":" + Endpoint.PORT_BACKEND + Endpoint.URL_GET_FORM + "/1";

        return await axios({
            method: "GET",
            url: url,
            timeout: Endpoint.TIMEOUT,
            withCredentials: false,
            headers: {
                'Accept': 'application/json',
                'Authorization': store.get("token_type") + ' ' + store.get('access_token')
            }
        });
    }


    constructor(full_name: string, email: string, phone: string, picture: string) {
        this._full_name = full_name;
        this._email = email;
        this._phone = phone;
        this._picture = picture;
    }

    get username(): string {
        return this._username;
    }

    set username(value: string) {
        this._username = value;
    }

    get full_name(): string {
        return this._full_name;
    }

    set full_name(value: string) {
        this._full_name = value;
    }

    get password(): string {
        return this._password;
    }

    set password(value: string) {
        this._password = value;
    }

    get email(): string {
        return this._email;
    }

    set email(value: string) {
        this._email = value;
    }

    get phone(): string {
        return this._phone;
    }

    set phone(value: string) {
        this._phone = value;
    }

    get picture(): string {
        return this._picture;
    }

    set picture(value: string) {
        this._picture = value;
    }


    get tree(): [Tree] {
        return this._tree;
    }

    set tree(value: [Tree]) {
        this._tree = value;
    }
}
