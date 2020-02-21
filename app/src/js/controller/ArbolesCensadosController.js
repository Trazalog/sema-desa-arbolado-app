import '../app';
require('bootstrap');
import * as $ from 'jquery';
import Vue from 'vue';
import MainHeader from '../../../component/main-header.vue';
import MisArbolesCensadosMap from '../../../component/mis-arboles-censados-map.vue';
import VeeValidate, { Validator } from 'vee-validate';
import * as es from 'vee-validate/dist/locale/es';
import { User } from "../model/User";
import { Connectivity } from "../model/Connectivity";
import store from 'store2';
import * as Vue2Leaflet from 'vue2-leaflet';
Validator.localize('es', es);
Vue.use(VeeValidate, {
    locale: 'es'
});
/* importante que sea global */
var map;
var vue = Vue;
new vue({
    el: '#mainArbolesCensados',
    components: {
        // @ts-ignore
        MainHeader: MainHeader,
        MisArbolesCensadosMap: MisArbolesCensadosMap,
        Vue2Leaflet: Vue2Leaflet
    },
    data: {
        infoWindow: null,
        my_tree_array: [],
        my_position: [],
        mymap: null
    },
    mounted: function () {
        this.initMap();
        //this.getMyTrees();
        //let mymap = document.getElementById('myTreesMap');
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
            //@ts-ignore
            this.mymap = L.map('myTreesMap').setView([0, 0], 13);
            var mymapaux = this.mymap;
            //@ts-ignore
            L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
                attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
                maxZoom: 18,
                id: 'mapbox/streets-v11',
                accessToken: 'your.mapbox.access.token'
            }).addTo(this.mymap);
            //@ts-ignore
            var testMarker = L.marker([-31.529472, -68.594056]).addTo(this.mymap);
            this.getMyTrees();
            // Try HTML5 geolocation.
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function (position) {
                    //@ts-ignore
                    var pos = [position.coords.latitude, position.coords.longitude];
                    //@ts-ignore
                    var markerCurrentPos = L.marker(pos).addTo(mymapaux);
                    //@ts-ignore
                    mymapaux.setView(pos, 13);
                    markerCurrentPos.bindPopup("Su ubicación actual es " + pos).openPopup();
                }, function () {
                    //this.handleLocationError(true, this.infoWindow, map.getCenter());
                    console.log("error al geolocalizar");
                });
            }
            else {
                // Browser doesn't support Geolocation
                console.log("el browser no soporta geolocalización ");
            }
        },
        getMyTrees: function () {
            var _this = this;
            var myTreeList;
            if (Connectivity.checkInternetSpeed() == "offline") {
                myTreeList = store.get('get_tree_response');
                console.log("DATA OFFLINE" + myTreeList);
                var selected_area = this.searchAndGetParamFromURL("selected_area");
                var selected_square = this.searchAndGetParamFromURL("selected_square");
                var tree_count = myTreeList[0].tree_list.data.area[selected_area].square[selected_square].tree.length;
                for (var i = 0; i < tree_count; i++) {
                    try {
                        var latAux = myTreeList[0].tree_list.data.area[selected_area].square[selected_square].tree[i].position.lat;
                        var lngAux = myTreeList[0].tree_list.data.area[selected_area].square[selected_square].tree[i].position.lng;
                        var addresAux = myTreeList[0].tree_list.data.area[selected_area].square[selected_square].tree[i].street + ' - ' + myTreeList[0].tree_list.data.area[selected_area].square[selected_square].tree[i].number;
                        if (latAux != null && lngAux != null) {
                            var positionAux = myTreeList[0].tree_list.data.area[selected_area].square[selected_square].tree[i].position;
                            var nameAux = myTreeList[0].tree_list.data.area[selected_area].square[selected_square].tree[i].name;
                            var treeIDAux = myTreeList[0].tree_list.data.area[selected_area].square[selected_square].tree[i].id;
                            this.my_tree_array.push(positionAux);
                            /*Append elements to list view*/
                            this.listViewElements(positionAux, nameAux, addresAux, treeIDAux);
                            /*Add markers to map view*/
                            this.addMapMarker(positionAux, nameAux, latAux, lngAux, addresAux, treeIDAux);
                            /*This is for getting new map center*/
                            this.setNewCenter(tree_count);
                            /*this is for draw area and square name into page title*/
                            var areaName = myTreeList[0].tree_list.data.area[selected_area].name;
                            var squareName = myTreeList[0].tree_list.data.area[selected_area].square[selected_square].name;
                            document.getElementById("page-title").innerHTML = 'Árboles censados para ' + areaName + ', ' + squareName;
                        }
                        else {
                            console.log('No se considera el marcador porque la longitud o latitud son nulas');
                        }
                    }
                    catch (e) {
                    }
                }
            }
            else {
                User.getTree().then(function (response) {
                    console.log("DATA ONLINE" + response.data);
                    var selected_area = _this.searchAndGetParamFromURL("selected_area");
                    var selected_square = _this.searchAndGetParamFromURL("selected_square");
                    var tree_count = response.data.tree_list.data.area[selected_area].square[selected_square].tree.length;
                    for (var i = 0; i < tree_count; i++) {
                        try {
                            var latAux = response.data.tree_list.data.area[selected_area].square[selected_square].tree[i].position.lat;
                            var lngAux = response.data.tree_list.data.area[selected_area].square[selected_square].tree[i].position.lng;
                            var addresAux = response.data.tree_list.data.area[selected_area].square[selected_square].tree[i].street + ' - ' + response.data.tree_list.data.area[selected_area].square[selected_square].tree[i].number;
                            if (latAux != null && lngAux != null) {
                                var positionAux = response.data.tree_list.data.area[selected_area].square[selected_square].tree[i].position;
                                var nameAux = response.data.tree_list.data.area[selected_area].square[selected_square].tree[i].name;
                                var treeIDAux = response.data.tree_list.data.area[selected_area].square[selected_square].tree[i].id;
                                _this.my_tree_array.push(positionAux);
                                /*Append elements to list view*/
                                _this.listViewElements(positionAux, nameAux, addresAux, treeIDAux);
                                /*Add markers to map view*/
                                _this.addMapMarker(positionAux, nameAux, latAux, lngAux, addresAux, treeIDAux);
                                /*This is for getting new map center*/
                                _this.setNewCenter(tree_count);
                                /*this is for draw area and square name into page title*/
                                var areaName = response.data.tree_list.data.area[selected_area].name;
                                var squareName = response.data.tree_list.data.area[selected_area].square[selected_square].name;
                                document.getElementById("page-title").innerHTML = 'Árboles censados para ' + areaName + ', ' + squareName;
                            }
                            else {
                                console.log('No se considera el marcador porque la longitud o latitud son nulas');
                            }
                        }
                        catch (e) {
                        }
                    }
                })
                    .catch(function (err) {
                    console.log("error: " + err);
                    //Session.invalidate();
                    //window.location.replace("/");
                });
            }
        },
        addMapMarker: function (position, nameAux, lat, lng, address, treeIDAux) {
            console.log('ADD MARKER INTO ' + this.mymap);
            if ((lat != null) && (lng != null)) {
                console.log("inside the if");
                var auxPosition = [lat, lng];
                var markerAuxLL_content = '<div id="content">' +
                    '<span style="position:relative; float:right"><a href="domicilioACensar.html?arbol_id=' + treeIDAux +
                    '&selected_area=' + this.searchAndGetParamFromURL("selected_area") +
                    '&area_id=' + this.searchAndGetParamFromURL("area_id") +
                    '&selected_square=' + this.searchAndGetParamFromURL("selected_square") +
                    '&square_id=' + this.searchAndGetParamFromURL("square_id") +
                    '&cens_id=' + this.searchAndGetParamFromURL("cens_id") + '"><i class="far fa-edit pl-1" style="color:#18BC9C"></i></a></span>' +
                    '<h6 id="firstHeading" class="map-tooltip-heading">' +
                    nameAux +
                    '</h6>' +
                    '<div>' +
                    '<p><b>' +
                    address +
                    '</div>';
                //@ts-ignore
                var markerAuxLL = new L.marker(auxPosition).addTo(this.mymap).bindPopup(markerAuxLL_content);
            }
            else {
                console.log('los datos de posición para este marcador no existen o son nulos, se omite su creación.');
            }
        },
        listViewElements: function (position, treeName, treeAdress, treeIDAux) {
            /*Agrego dinámicamente unos divs en la vista de lista.*/
            var listViewLink = 'domicilioACensar.html?arbol_id=' + treeIDAux +
                '&selected_area=' + this.searchAndGetParamFromURL("selected_area") +
                '&area_id=' + this.searchAndGetParamFromURL("area_id") +
                '&selected_square=' + this.searchAndGetParamFromURL("selected_square") +
                '&square_id=' + this.searchAndGetParamFromURL("square_id") +
                '&cens_id=' + this.searchAndGetParamFromURL("cens_id");
            var linkElementAux = document.createElement('a');
            linkElementAux.innerHTML = "<i class='far fa-edit pl-1 style='color:#18BC9C'>" + "</i>" +
                '<strong>' + treeName + '</strong>' + ' - ' + treeAdress + '-' + JSON.stringify(position);
            linkElementAux.setAttribute('class', 'list-group-item list-group-item-action');
            linkElementAux.setAttribute('href', listViewLink);
            document.getElementById('listview').appendChild(linkElementAux);
        },
        setNewCenter: function (elements) {
            console.log("Setting new map's center");
            var latArrayAux = [];
            var lngArrayAux = [];
            var qElements = elements;
            for (var i = 0; i < qElements; i++) {
                var auxLatValue = this.my_tree_array[i].lat;
                var auxLngValue = this.my_tree_array[i].lng;
                if ((auxLatValue !== null) && (auxLngValue !== null)) {
                    latArrayAux.push(auxLatValue);
                    lngArrayAux.push(auxLngValue);
                }
                else {
                    console.log('lat or pos null');
                }
            }
            console.log('ARREGLO DE LATITUDES EN SETNEWCENTER ' + latArrayAux);
            console.log('ARREGLO DE LONGITUDES EN SETNEWCENTER ' + lngArrayAux);
            var maxLat = Math.max.apply(null, latArrayAux);
            var minLat = Math.min.apply(null, latArrayAux);
            var avgLat = (maxLat + minLat) / 2;
            var maxLng = Math.max.apply(null, lngArrayAux);
            var minLng = Math.min.apply(null, lngArrayAux);
            var avgLng = (maxLng + minLng) / 2;
            var newCenter = [avgLat, avgLng];
            this.mymap.setView(newCenter, 8);
        },
        setParamsAndRedirect: function (selected_area, area_id, selected_square, square_id, cens_id) {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function (position) {
                    $(".se-pre-con").show();
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
            window.location.replace("manzanasCensadas.html?" +
                "selected_area=" + this.searchAndGetParamFromURL("selected_area") +
                "&area_id=" + this.searchAndGetParamFromURL("area_id") +
                "&cens_id=" + this.searchAndGetParamFromURL("cens_id"));
        }
    }
});
//# sourceMappingURL=ArbolesCensadosController.js.map