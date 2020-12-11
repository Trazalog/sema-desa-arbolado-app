import axios from "axios";

import {Session} from "./Session";

import {Endpoint} from "./Endpoint";
import {Tree} from "./Tree";
import * as store from "store2"
import { cacheAdapterEnhancer, throttleAdapterEnhancer } from 'axios-extensions';


export class Form {




    /*** Get the empty form template, with all filds for drawing it on screen ***/
    public static async getTemplate(){
        let url: string = Endpoint.PROTOCOL + "://" + Endpoint.HOSTNAME_BACKEND + ":" + Endpoint.PORT_BACKEND + Endpoint.URL_GET_FORM_TEMPLATE;
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


    /*** Get a completed form for show its data on screen to be modified ***/
    public static async getFormData(formID){
        //this is an example for the URL https://soa.sanjuan.gob.ar/censarb/api/arbolado/api/ds/v1.0.0/formulario/'+this.formID
        let url: string = Endpoint.PROTOCOL + "://" + Endpoint.HOSTNAME_BACKEND + ":" + Endpoint.PORT_BACKEND + Endpoint.URL_GET_FORM + formID;
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



    /*** Instance form ***/
    public static async createInstance(){

        /**EndoPoint for requestBox**/
        let url: string = Endpoint.PROTOCOL + "://" + Endpoint.HOSTNAME_BACKEND + ":" + Endpoint.PORT_BACKEND + Endpoint.URL_INSTANCE_FORM;

        return await axios({
            method: "POST",
            url: url,
            timeout: Endpoint.TIMEOUT,
            withCredentials: false,
            data:{
                "request_box":{
                    "_post_instanciarform":{
                        "form_id":2
                    },
                    "_get_info_id":{
                        "a":"a"
                    }
                }
            },
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': store.get("token_type") + ' ' + store.get('access_token')
            }
        })
    }



    public static async sendDynamicFormData(data: any, method: string){

        let url: string = Endpoint.PROTOCOL + "://" + Endpoint.HOSTNAME_BACKEND + ":" + Endpoint.PORT_BACKEND + Endpoint.URL_PUT_FORM;

        return await axios({
            method: method,
            url: url,
            timeout: Endpoint.TIMEOUT,
            withCredentials: false,
            data: data,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': store.get("token_type") + ' ' + store.get('access_token')
            }
        })
    }

    public static async sendDynamicFormDataOffline(data: any, method: string){

        let url: string = Endpoint.PROTOCOL + "://" + Endpoint.HOSTNAME_BACKEND + ":" + Endpoint.PORT_BACKEND + Endpoint.URL_POST_FORM_OFFLINE;

        return await axios({
            method: method,
            url: url,
            timeout: Endpoint.TIMEOUT,
            withCredentials: false,
            data: data,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': store.get("token_type") + ' ' + store.get('access_token')
            }
        })
    }


    public static async sendOnlyTreePicture(data: any, method: string){

        let url: string = Endpoint.PROTOCOL + "://" + Endpoint.HOSTNAME_BACKEND + ":" + Endpoint.PORT_BACKEND + Endpoint.URL_POST_NEW_TREE;

        return await axios({
            method: method,
            url: url,
            timeout: Endpoint.TIMEOUT,
            withCredentials: false,
            data: data,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': store.get("token_type") + ' ' + store.get('access_token')
            }
        })
    }
}
