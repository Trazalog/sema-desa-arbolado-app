import axios from "axios";
import {Session} from "./Session";
import {Endpoint} from "./Endpoint";
import * as store from "store2";


export class Tree {

    private _name: string;
    private _position: {lat: number, lng: number};
    private _ID: number;


    constructor(name: string, position: { lat: number; lng: number }) {
        this._name = name;
        this._position = position;
    }

    get name(): string {
        return this._name;
    }

    set name(value: string) {
        this._name = value;
    }

    get position(): { lat: number; lng: number } {
        return this._position;
    }

    set position(value: { lat: number; lng: number }) {
        this._position = value;
    }

    public static async getInfo(treeID) {

        let url: string = Endpoint.PROTOCOL + "://" + Endpoint.HOSTNAME_BACKEND + ":" + Endpoint.PORT_BACKEND + Endpoint.URL_GET_TREE_DATA + "/" + treeID;

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

    public static async getPhoto(treeID){

        let url: string = Endpoint.PROTOCOL + "://" + Endpoint.HOSTNAME_BACKEND + ":" + Endpoint.PORT_BACKEND + Endpoint.URL_GET_TREE_DATA+ "/" + treeID + "/imagen";

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
}