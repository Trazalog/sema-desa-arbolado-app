import '../app';

require('bootstrap');

import * as $ from 'jquery';

import Vue from 'vue';
import {Tree} from '../model/Tree';

import MainHeader from '../../../component/main-header.vue';

import VeeValidate, { Validator } from 'vee-validate';

import * as es from 'vee-validate/dist/locale/es';

import vSelect from 'vue-select'

import {default as store, User} from "../model/User";
import {Session} from "../model/Session";
import {Endpoint} from "../model/Endpoint";
import axios from "axios";

Vue.component('v-select', vSelect);

Validator.localize('es', es);

Vue.use(VeeValidate, {
    locale: 'es'
});



let vue: any = Vue;
new vue ({
        el: '#mainDomicilioACensar',
        components: {
            // @ts-ignore
            MainHeader
        },
        data: {
            alert_title: '',
            alert_message: '',
            valid_step1: false,
            street_name: '',
            street_number: '',
            calleOtra: '',
            neighborhood: '',
            address_taza: '',
            list_street: [],
            tazaList: [
                'Taza con árbol',
                'Taza vacía',
                'Taza con tacón',
                'Sin Taza'
            ],
            arbol_id:'',
            form_id:'',
            current_lat:'',
            current_lng:''
        },
        mounted(){

            this.getStreets();
            //console.log("Lista en mounted(): " + this.list_street);
            this.getTreeData();

            // Remove loading
           // not here $(".se-pre-con").fadeOut("slow");
        },
        methods: {
            searchAndGetParamFromURL(param: string){
                let searchParams = new URLSearchParams(window.location.search);
                let response = null;

                switch (param) {

                    case "selected_area": response = searchParams.get('selected_area'); break;

                    case "area_id": response = searchParams.get('area_id'); break;

                    case "selected_square": response = searchParams.get('selected_square'); break;

                    case "square_id": response = searchParams.get('square_id'); break;

                    case "current_lat": response = searchParams.get('current_lat'); break;

                    case "current_lng": response = searchParams.get('current_lng'); break;

                    case "selected_street": response = searchParams.get('selected_street'); break;

                    case "calleOtra": response = searchParams.get('calleOtra'); break;

                    case "number": response = searchParams.get('number'); break;

                    case "neighborhood": response = searchParams.get('neighborhood'); break;

                    case "taza": response = searchParams.get('taza'); break;

                    case "cens_id": response = searchParams.get('cens_id'); break;

                    case "arbol_id": response = searchParams.get('arbol_id'); break;

                }

                return response;
            },
            getStreets (){
                let area = this.searchAndGetParamFromURL("selected_area");
                let square = this.searchAndGetParamFromURL("selected_square");
                let treeID = this.searchAndGetParamFromURL("arbol_id");
                User.getAllStreets().then(response => {
                    if (area !== "not_found" && square !== "not_found") {
                        this.list_street = response.data.tree_list.data.area[area].square[square].street;
                        this.list_street.push("Otra");
                        // Remove loading
                        $(".se-pre-con").fadeOut("slow");
                    } else {
                        $(".se-pre-con").fadeOut("slow");
                        $("h5:first-child").append("<p class=\"text-dark main-font pt-5\">No se encontraron elementos.</p>");
                    }

                }).catch((err)=>{
                    console.log('error getting street list');

                    //Session.invalidate();

                    //window.location.replace("/");
                    $(".se-pre-con").fadeOut("slow");
                });
            },
            goBack(){

                if( this.searchAndGetParamFromURL("arbol_id") != "" || this.searchAndGetParamFromURL("arbol_id") != null) {

                    window.location.replace("arbolesCensados.html?" +
                        "selected_area="+this.searchAndGetParamFromURL("selected_area") +
                        "&area_id=" + this.searchAndGetParamFromURL("area_id") +
                        "&selected_square=" + this.searchAndGetParamFromURL("selected_square") +
                        "&square_id=" + this.searchAndGetParamFromURL("square_id") +
                        "&cens_id=" + this.searchAndGetParamFromURL("cens_id")+
                        "&arbol_id=" + this.searchAndGetParamFromURL("arbol_id"));

                } else {

                    window.location.replace("nuevaUbicacion.html?" +
                        "selected_area="+this.searchAndGetParamFromURL("selected_area") +
                        "&area_id=" + this.searchAndGetParamFromURL("area_id") +
                        "&selected_square=" + this.searchAndGetParamFromURL("selected_square") +
                        "&square_id=" + this.searchAndGetParamFromURL("square_id") +
                        "&cens_id=" + this.searchAndGetParamFromURL("cens_id")+
                        "&arbol_id=" + this.searchAndGetParamFromURL("arbol_id"));
                }
            },

            getTreeData(){
              let treeID = this.searchAndGetParamFromURL("arbol_id");
              if (treeID != null){
                  console.log('Se ha llegado con un id de arbol para modificarlo' + treeID );
                  /*** get treeInfo ***/
                  Tree.getInfo(treeID).then(response=>{
                      console.log('DATOS RECUPERADOS DEL ARBOL' + JSON.stringify(response.data));
                      this.address_taza=response.data.arbol.taza;
                      this.form_id=response.data.arbol.info_id;

                      this.street_name=response.data.arbol.nom_calle;

                      this.street_number=response.data.arbol.altura;
                      this.neighborhood=response.data.arbol.barrio;
                      this.current_lat=response.data.arbol.lat;
                      this.current_lng=response.data.arbol.lng;
                      $(".se-pre-con").fadeOut("slow");
                  }).catch(error=>console.log(error))



              }else{
                  console.log('El usuario desea ingresar un nuevo arbol');
              }

            },
            selectedLocation() {
                this.$validator.validateAll().then(isValid => {

                    /*** Message modal ***/
                    let message = $("#message");


                    if (isValid) {
                        this.valid_step1 = true;
                        if(this.searchAndGetParamFromURL("arbol_id")!=null){
                            window.location.replace("formulario.html?" +
                                "selected_area=" + this.searchAndGetParamFromURL("selected_area") +
                                "&area_id=" + this.searchAndGetParamFromURL("area_id") +
                                "&selected_square=" + this.searchAndGetParamFromURL("selected_square") +
                                "&square_id=" + this.searchAndGetParamFromURL("square_id") +
                                "&current_lat=" + this.current_lat+
                                "&current_lng=" + this.current_lng +
                                "&selected_street=" + this.street_name +
                                "&calleOtra="+this.calleOtra+
                                "&number=" + this.street_number +
                                "&neighborhood=" + this.neighborhood+
                                "&taza=" + this.address_taza +
                                "&form_id="+this.form_id+
                                "&cens_id=" + this.searchAndGetParamFromURL("cens_id")+
                                "&tree_id=" + this.searchAndGetParamFromURL("arbol_id")
                            );
                        }else{

                        window.location.replace("formulario.html?" +
                            "selected_area=" + this.searchAndGetParamFromURL("selected_area") +
                            "&area_id=" + this.searchAndGetParamFromURL("area_id") +
                            "&selected_square=" + this.searchAndGetParamFromURL("selected_square") +
                            "&square_id=" + this.searchAndGetParamFromURL("square_id") +
                            "&current_lat=" + this.searchAndGetParamFromURL("current_lat") +
                            "&current_lng=" + this.searchAndGetParamFromURL("current_lng") +
                            "&selected_street=" + this.street_name +
                            "&calleOtra="+this.calleOtra+
                            "&number=" + this.street_number +
                            "&neighborhood=" + this.neighborhood+
                            "&taza=" + this.address_taza +
                            "&form_id="+this.form_id+
                            "&cens_id=" + this.searchAndGetParamFromURL("cens_id")+
                            "&tree_id=" + this.searchAndGetParamFromURL("arbol_id")
                        );
                        }

                    } else {

                        /*** Prepare and show message ***/
                        this.alert_title = "Error de datos";
                        this.alert_message = "Debes corregir los datos resaltados con error antes de continuar.";


                        message.find(".modal-content").removeClass("modal-danger");
                        message.find(".modal-content").addClass("modal-warning");
                        (<any>message).modal("show");

                    }

                }).catch(() => {

                    this.$validator.errors.clear();
                });
            }
        }

    }
);
