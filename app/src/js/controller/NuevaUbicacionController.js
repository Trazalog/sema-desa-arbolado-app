import '../app';
require('bootstrap');
import * as $ from 'jquery';
import Vue from 'vue';
import MainHeader from '../../../component/main-header.vue';
import VeeValidate, { Validator } from 'vee-validate';
import * as es from 'vee-validate/dist/locale/es';
import { User } from "../model/User";
import { Session } from "../model/Session";
import { Connectivity } from "../model/Connectivity";
import * as store from "store2";
import llmap from '../../../component/llmap.vue';
Validator.localize('es', es);
Vue.use(VeeValidate, {
    locale: 'es'
});
/* importante que sea global */
var map;
var vue = Vue;
new vue({
    el: '#mainNuevaUbicacion',
    components: {
        // @ts-ignore
        MainHeader: MainHeader,
        llmap: llmap
    },
    data: {
        infoWindow: null,
        my_tree_array: [],
        my_position: {
            lat: null,
            lng: null
        },
        my_llPosition: [],
    },
    mounted: function () {
        if (Connectivity.checkInternetSpeed() !== "offline")
            this.initMap();
        //this.getMyTrees();
        // Remove loading
        $(".se-pre-con").fadeOut("slow");
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
            }
            return response;
        },
        initMap: function () {
            //map = new google.maps.Map(document.getElementById('map'), {
            //    center:  {lat: -31.5375000, lng:  -68.5363900},
            //    zoom: 12,
            //    mapTypeControl:false,
            //    mapTypeId: google.maps.MapTypeId.ROADMAP,
            //    styles: [
            //        {
            //            featureType: "poi",
            //            stylers: [
            //                { visibility: "off" }
            //            ]
            //        }
            //  ]
            //});
            //this.infoWindow = new google.maps.InfoWindow;
            // Try HTML5 geolocation. - this stays for calculate parameters to send to next screen
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function (position) {
                    var pos = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };
                    // let currentPosMarker = new google.maps.Marker({
                    //     position:pos,
                    //    icon: {url:"https://maps.google.com/mapfiles/ms/icons/green-dot.png"},
                    //    map: map,
                    //    title: 'Mi ubicación actual'
                    //});
                    //map.setCenter(pos);
                    // Remove loading
                    $(".se-pre-con").fadeOut("slow");
                    console.log(JSON.stringify(pos));
                }, function () {
                    this.handleLocationError(true, this.infoWindow, map.getCenter());
                });
            }
            else {
                // Browser doesn't support Geolocation
                console.log("Su navegador no soporta geolocalización");
                //this.handleLocationError(false, this.infoWindow, map.getCenter());
            }
        },
        //handleLocationError(browserHasGeolocation, infoWindow, pos) {
        //    infoWindow.setPosition(pos);
        //    infoWindow.setContent(browserHasGeolocation ?
        //        'Error: El servicio de geolocalizacion ha fallado.' :
        //        'Error: Su navegador no soporta geolocalizacion.');
        //    infoWindow.open(map);
        //},
        getMyTrees: function () {
            var _this = this;
            User.getTree().then(function (response) {
                console.log(response.data);
                var selected_area = _this.searchAndGetParamFromURL("selected_area");
                var selected_square = _this.searchAndGetParamFromURL("selected_square");
                var tree_count = response.data.tree_list.data.area[selected_area].square[selected_square].tree.length;
                for (var i = 0; i < tree_count; i++) {
                    var positionAux = response.data.tree_list.data.area[selected_area].square[selected_square].tree[i].position;
                    var nameAux = response.data.tree_list.data.area[selected_area].square[selected_square].tree[i].name;
                    //     console.log('Posición auxiliar del árbol: --->'+positionAux);
                    _this.my_tree_array.push(positionAux);
                    _this.addMapMarker(positionAux, nameAux);
                }
            })
                .catch(function (err) {
                console.log("error: " + err);
                if (!err.response) {
                    var response = {
                        data: store.get("get_tree_response")
                    };
                    var selected_area = _this.searchAndGetParamFromURL("selected_area");
                    var selected_square = _this.searchAndGetParamFromURL("selected_square");
                    var tree_count = response.data.tree_list.data.area[selected_area].square[selected_square].tree.length;
                    for (var i = 0; i < tree_count; i++) {
                        var positionAux = response.data.tree_list.data.area[selected_area].square[selected_square].tree[i].position;
                        var nameAux = response.data.tree_list.data.area[selected_area].square[selected_square].tree[i].name;
                        //console.log('Posición auxiliar del árbol: --->'+positionAux);
                        _this.my_tree_array.push(positionAux);
                        //alert("mostrar lista de árboles en vez de mapa google. positionAux=" + positionAux.toString() + " - nameAux=" + nameAux);
                        _this.addMapMarker(positionAux, nameAux);
                    }
                }
                else {
                    Session.invalidate();
                    window.location.replace("/");
                }
            });
        },
        addMapMarker: function (position, nameAux) {
            var markerAux = new google.maps.Marker({
                position: { lat: position.lat, lng: position.lng },
                map: map,
                icon: { url: "https://maps.google.com/mapfiles/ms/icons/red-dot.png" },
                title: nameAux
            });
        },
        setParamsAndRedirect: function (selected_area, area_id, selected_square, square_id, cens_id) {
            $(".se-pre-con").show();
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function (position) {
                    window.location.replace("domicilioACensar.html?" +
                        "selected_area=" + selected_area +
                        "&area_id=" + area_id +
                        "&selected_square=" + selected_square +
                        "&square_id=" + square_id +
                        "&current_lat=" + position.coords.latitude +
                        "&current_lng=" + position.coords.longitude +
                        "&cens_id=" + cens_id);
                });
            }
        },
        selectedParams: function () {
            this.setParamsAndRedirect(this.searchAndGetParamFromURL("selected_area"), this.searchAndGetParamFromURL("area_id"), this.searchAndGetParamFromURL("selected_square"), this.searchAndGetParamFromURL("square_id"), this.searchAndGetParamFromURL("cens_id"));
        },
        goBack: function () {
            window.location.replace("manzanasAsignadas.html?" +
                "selected_area=" + this.searchAndGetParamFromURL("selected_area") +
                "&area_id=" + this.searchAndGetParamFromURL("area_id") +
                "&cens_id=" + this.searchAndGetParamFromURL("cens_id"));
        }
    }
});
//# sourceMappingURL=NuevaUbicacionController.js.map