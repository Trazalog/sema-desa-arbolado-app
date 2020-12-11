import '../app';
require('bootstrap');
import * as $ from 'jquery';
import Vue from 'vue';
import { Tree } from '../model/Tree';
import MainHeader from '../../../component/main-header.vue';
import VeeValidate, { Validator } from 'vee-validate';
import * as es from 'vee-validate/dist/locale/es';
import * as store from "store2";
import vSelect from 'vue-select';
import { User } from "../model/User";
import { Connectivity } from "../model/Connectivity";
Vue.component('v-select', vSelect);
Validator.localize('es', es);
Vue.use(VeeValidate, {
    locale: 'es'
});
var vue = Vue;
new vue({
    el: '#mainDomicilioACensar',
    components: {
        // @ts-ignore
        MainHeader: MainHeader
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
            'Taza con tocón',
            'Sin Taza'
        ],
        arbol_id: '',
        form_id: '',
        current_lat: '',
        current_lng: ''
    },
    mounted: function () {
        this.getStreets();
        //console.log("Lista en mounted(): " + this.list_street);
        this.getTreeData();
        // Remove loading
        // not here $(".se-pre-con").fadeOut("slow");
    },
    methods: {
        searchAndGetParamFromURL: function (param) {
            var searchParams = new URLSearchParams(window.location.search);
            var response = null;
            switch (param) {
                case "selected_area":
                    response = searchParams.get('selected_area');
                    break;
                case "area_id":
                    response = searchParams.get('area_id');
                    break;
                case "selected_square":
                    response = searchParams.get('selected_square');
                    break;
                case "square_id":
                    response = searchParams.get('square_id');
                    break;
                case "current_lat":
                    response = searchParams.get('current_lat');
                    break;
                case "current_lng":
                    response = searchParams.get('current_lng');
                    break;
                case "selected_street":
                    response = searchParams.get('selected_street');
                    break;
                case "calleOtra":
                    response = searchParams.get('calleOtra');
                    break;
                case "number":
                    response = searchParams.get('number');
                    break;
                case "neighborhood":
                    response = searchParams.get('neighborhood');
                    break;
                case "taza":
                    response = searchParams.get('taza');
                    break;
                case "cens_id":
                    response = searchParams.get('cens_id');
                    break;
                case "arbol_id":
                    response = searchParams.get('arbol_id');
                    break;
            }
            return response;
        },
        getStreets: function () {
            var _this = this;
            var area = this.searchAndGetParamFromURL("selected_area");
            var square = this.searchAndGetParamFromURL("selected_square");
            var treeID = this.searchAndGetParamFromURL("arbol_id");
            if (Connectivity.checkInternetSpeed() !== "offline") {
                console.log("Lo toma online ? " + Connectivity.checkInternetSpeed());
                User.getAllStreets().then(function (response) {
                    if (area !== "not_found" && square !== "not_found") {
                        _this.list_street = response.data.tree_list.data.area[area].square[square].street;
                        _this.list_street.push("Otra");
                        // Remove loading
                        $(".se-pre-con").fadeOut("slow");
                    }
                    else {
                        $(".se-pre-con").fadeOut("slow");
                        $("h5:first-child").append("<p class=\"text-dark main-font pt-5\">No se encontraron elementos.</p>");
                    }
                }).catch(function (err) {
                    console.log('error getting street list');
                    //Session.invalidate();
                    //window.location.replace("/");
                    $(".se-pre-con").fadeOut("slow");
                });
            }
            else {
                console.log("Lo toma offline ? " + Connectivity.checkInternetSpeed());
                var response = store.get("get_tree_response");
                if (area !== "not_found" && square !== "not_found") {
                    this.list_street = response.tree_list.data.area[area].square[square].street;
                    this.list_street.push("Otra");
                    // Remove loading
                    $(".se-pre-con").fadeOut("slow");
                }
                else {
                    $(".se-pre-con").fadeOut("slow");
                    $("h5:first-child").append("<p class=\"text-dark main-font pt-5\">No se encontraron elementos.</p>");
                }
            }
        },
        goBack: function () {
            if (this.searchAndGetParamFromURL("arbol_id") != "" || this.searchAndGetParamFromURL("arbol_id") != null) {
                window.location.replace("arbolesCensados.html?" +
                    "selected_area=" + this.searchAndGetParamFromURL("selected_area") +
                    "&area_id=" + this.searchAndGetParamFromURL("area_id") +
                    "&selected_square=" + this.searchAndGetParamFromURL("selected_square") +
                    "&square_id=" + this.searchAndGetParamFromURL("square_id") +
                    "&cens_id=" + this.searchAndGetParamFromURL("cens_id") +
                    "&arbol_id=" + this.searchAndGetParamFromURL("arbol_id"));
            }
            else {
                window.location.replace("nuevaUbicacion.html?" +
                    "selected_area=" + this.searchAndGetParamFromURL("selected_area") +
                    "&area_id=" + this.searchAndGetParamFromURL("area_id") +
                    "&selected_square=" + this.searchAndGetParamFromURL("selected_square") +
                    "&square_id=" + this.searchAndGetParamFromURL("square_id") +
                    "&cens_id=" + this.searchAndGetParamFromURL("cens_id") +
                    "&arbol_id=" + this.searchAndGetParamFromURL("arbol_id"));
            }
        },
        getTreeData: function () {
            var _this = this;
            var treeID = this.searchAndGetParamFromURL("arbol_id");
            if (treeID != null) {
                console.log('Se ha llegado con un id de arbol para modificarlo' + treeID);
                /*** get treeInfo ***/
                Tree.getInfo(treeID).then(function (response) {
                    console.log('DATOS RECUPERADOS DEL ARBOL' + JSON.stringify(response.data));
                    _this.address_taza = response.data.arbol.taza;
                    _this.form_id = response.data.arbol.info_id;
                    _this.street_name = response.data.arbol.nom_calle;
                    _this.street_number = response.data.arbol.altura;
                    _this.neighborhood = response.data.arbol.barrio;
                    _this.current_lat = response.data.arbol.lat;
                    _this.current_lng = response.data.arbol.lng;
                    $(".se-pre-con").fadeOut("slow");
                }).catch(function (error) { return console.log(error); });
            }
            else {
                console.log('El usuario desea ingresar un nuevo arbol');
            }
        },
        selectedLocation: function () {
            var _this = this;
            this.$validator.validateAll().then(function (isValid) {
                /*** Message modal ***/
                var message = $("#message");
                if (isValid) {
                    _this.valid_step1 = true;
                    if (_this.searchAndGetParamFromURL("arbol_id") != null) {
                        window.location.replace("formulario.html?" +
                            "selected_area=" + _this.searchAndGetParamFromURL("selected_area") +
                            "&area_id=" + _this.searchAndGetParamFromURL("area_id") +
                            "&selected_square=" + _this.searchAndGetParamFromURL("selected_square") +
                            "&square_id=" + _this.searchAndGetParamFromURL("square_id") +
                            "&current_lat=" + _this.current_lat +
                            "&current_lng=" + _this.current_lng +
                            "&selected_street=" + _this.street_name +
                            "&calleOtra=" + _this.calleOtra +
                            "&number=" + _this.street_number +
                            "&neighborhood=" + _this.neighborhood +
                            "&taza=" + _this.address_taza +
                            "&form_id=" + _this.form_id +
                            "&cens_id=" + _this.searchAndGetParamFromURL("cens_id") +
                            "&tree_id=" + _this.searchAndGetParamFromURL("arbol_id"));
                    }
                    else {
                        window.location.replace("formulario.html?" +
                            "selected_area=" + _this.searchAndGetParamFromURL("selected_area") +
                            "&area_id=" + _this.searchAndGetParamFromURL("area_id") +
                            "&selected_square=" + _this.searchAndGetParamFromURL("selected_square") +
                            "&square_id=" + _this.searchAndGetParamFromURL("square_id") +
                            "&current_lat=" + _this.searchAndGetParamFromURL("current_lat") +
                            "&current_lng=" + _this.searchAndGetParamFromURL("current_lng") +
                            "&selected_street=" + _this.street_name +
                            "&calleOtra=" + _this.calleOtra +
                            "&number=" + _this.street_number +
                            "&neighborhood=" + _this.neighborhood +
                            "&taza=" + _this.address_taza +
                            "&form_id=" + _this.form_id +
                            "&cens_id=" + _this.searchAndGetParamFromURL("cens_id") +
                            "&tree_id=" + _this.searchAndGetParamFromURL("arbol_id"));
                    }
                }
                else {
                    /*** Prepare and show message ***/
                    _this.alert_title = "Error de datos";
                    _this.alert_message = "Debes corregir los datos resaltados con error antes de continuar.";
                    message.find(".modal-content").removeClass("modal-danger");
                    message.find(".modal-content").addClass("modal-warning");
                    message.modal("show");
                }
            }).catch(function () {
                _this.$validator.errors.clear();
            });
        }
    }
});
//# sourceMappingURL=DomicilioACensarController.js.map