import '../app';
require('bootstrap');
import * as $ from 'jquery';
import Vue from 'vue';

import MainHeader from '../../../component/main-header.vue';
import MisArbolesCensadosMap from '../../../component/mis-arboles-censados-map.vue';
import VeeValidate, { Validator } from 'vee-validate';
import * as es from 'vee-validate/dist/locale/es';
import {User} from "../model/User";
import {Session} from "../model/Session";
import {Connectivity} from "../model/Connectivity";
import store from 'store2';
import * as Vue2Leaflet from 'vue2-leaflet';

Validator.localize('es', es);
Vue.use(VeeValidate, {
    locale: 'es'
});

/* importante que sea global */
let map: any;

let vue: any = Vue;
new vue ({
    el: '#mainArbolesCensados',
    components: {
        // @ts-ignore
        MainHeader,
        MisArbolesCensadosMap,
        Vue2Leaflet
    },
    data: {
        infoWindow: null,
        my_tree_array: [],
        my_position: [],
        mymap:null
    },
    mounted(){
        console.log("RODOLFO muy CAMPEON");
        this.initMap();
        //this.getMyTrees();


        //let mymap = document.getElementById('myTreesMap');

        // Remove loading
        $(".se-pre-con").fadeOut("slow");
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
            }
            return response;
        },
        initMap (){
            //@ts-ignore
            this.mymap = L.map('myTreesMap').setView([0,0],13);
            let mymapaux = this.mymap;
            //@ts-ignore
           // L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw',
        //        {
          //          attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
         //           maxZoom: 18,
         //           id: 'mapbox/streets-v11',
        //            accessToken: 'your.mapbox.access.token'
        //        }).addTo(this.mymap);


            //@ts-ignore
            var osm = L.tileLayer('https://{s}.tile.osm.org/{z}/{x}/{y}.png',{
                attribution: '<a href="" target="_blank">Secretaria de Estado de Ambiente y Desarrollo Sustentable. Gobierno de San Juan. Argentina.</a>'
            }).addTo(mymapaux);


            //@ts-ignore
            var osm_bn =  L.tileLayer('https://tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png',{
                attribution: ''
            });


            // Capa Base layer de Google Satellite.
            //@ts-ignore
            var layer_google_satellite = L.tileLayer('https://www.google.cn/maps/vt?lyrs=s@189&gl=cn&x={x}&y={y}&z={z}', {
                opacity: 1.0,
                attribution: '',
                minZoom: 1,
                maxZoom: 28,
                minNativeZoom: 0,
                maxNativeZoom: 19
            });
            layer_google_satellite;

            // Capa Base layer de ESRI Satellite.
            //@ts-ignore
            var layer_ESRI_satellite = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
                opacity: 1.0,
                attribution: '',
                minZoom: 1,
                maxZoom: 28,
                minNativeZoom: 0,
                maxNativeZoom: 19
            });
            layer_ESRI_satellite;

            function style_capital_manzanas_0_0() {
                return {
                    pane: 'pane_capital_manzanas_0',
                    opacity: 1,
                    color: 'rgba(0,0,0,0.5)',
                    dashArray: '',
                    lineCap: 'butt',
                    lineJoin: 'miter',
                    weight: 1.0,
                    fill: true,
                    fillOpacity: 1,
                    fillColor: 'rgba(215,215,215,0.5)',
                }
            }
            mymapaux.createPane('pane_capital_manzanas_0');
            mymapaux.getPane('pane_capital_manzanas_0').style.zIndex = 400;
            mymapaux.getPane('pane_capital_manzanas_0').style['mix-blend-mode'] = 'normal';
            //@ts-ignore
            var layer_capital_manzanas_0 = new L.geoJson(json_capital_manzanas_0, {
                attribution: '<a href=""></a>',
                pane: 'pane_capital_manzanas_0',
                style: style_capital_manzanas_0_0,
            });
            //@ts-ignore
           // bounds_group.addLayer(layer_capital_manzanas_0);
            mymapaux.addLayer(layer_capital_manzanas_0);

            function style_espacios_verdes_2020_1_0() {
                return {
                    pane: 'pane_espacios_verdes_2020_1',
                    opacity: 1,
                    color: 'rgba(0,0,0,1.0)',
                    dashArray: '',
                    lineCap: 'butt',
                    lineJoin: 'miter',
                    weight: 1.0,
                    fill: true,
                    fillOpacity: 1,
                    fillColor: 'rgba(104,160,87,1.0)',
                }
            }
            mymapaux.createPane('pane_espacios_verdes_2020_1');
            mymapaux.getPane('pane_espacios_verdes_2020_1').style.zIndex = 401;
            mymapaux.getPane('pane_espacios_verdes_2020_1').style['mix-blend-mode'] = 'normal';
            //@ts-ignore
            var layer_espacios_verdes_2020_1 = new L.geoJson(json_espacios_verdes_2020_1, {
                attribution: '<a href=""></a>',
                pane: 'pane_espacios_verdes_2020_1',
                style: style_espacios_verdes_2020_1_0,
            });
            //@ts-ignore
            bounds_group.addLayer(layer_espacios_verdes_2020_1);
            mymapaux.addLayer(layer_espacios_verdes_2020_1);

            function style_infraestructura_2_0() {
                return {
                    pane: 'pane_infraestructura_2',
                    opacity: 1,
                    color: 'rgba(222,133,190,1.0)',
                    dashArray: '',
                    lineCap: 'square',
                    lineJoin: 'bevel',
                    weight: 1.0,
                    fillOpacity: 0,
                }
            }
            mymapaux.createPane('pane_infraestructura_2');
            mymapaux.getPane('pane_infraestructura_2').style.zIndex = 402;
            mymapaux.getPane('pane_infraestructura_2').style['mix-blend-mode'] = 'normal';
            //@ts-ignore
            var layer_infraestructura_2 = new L.geoJson(json_infraestructura_2, {
                attribution: '<a href=""></a>',
                pane: 'pane_infraestructura_2',
                style: style_infraestructura_2_0,
            });
            //@ts-ignore
           // bounds_group.addLayer(layer_infraestructura_2);
            mymapaux.addLayer(layer_infraestructura_2);

            function style_calles_2020_3_0() {
                return {
                    pane: 'pane_calles_2020_3',
                    opacity: 1,
                    color: 'rgba(80,156,242,1.0)',
                    dashArray: '',
                    lineCap: 'square',
                    lineJoin: 'bevel',
                    weight: 1.0,
                    fillOpacity: 0,
                }
            }
            mymapaux.createPane('pane_calles_2020_3');
            mymapaux.getPane('pane_calles_2020_3').style.zIndex = 403;
            mymapaux.getPane('pane_calles_2020_3').style['mix-blend-mode'] = 'normal';
            //@ts-ignore
            var layer_calles_2020_3 = new L.geoJson(json_calles_2020_3, {
                attribution: '<a href=""></a>',
                pane: 'pane_calles_2020_3',
                minZoom: 17,
                maxZoom: 28,
                minNativeZoom: 17,
                maxNativeZoom: 28,
                style: style_calles_2020_3_0,
            });
            //@ts-ignore
           // bounds_group.addLayer(layer_calles_2020_3);

            var capas_base = {
                "capa base OSM": osm,
                "capa base OSM Blanco y Negro": osm_bn,
                "Satelite de Google": layer_google_satellite,
                "Satelite de ESRI": layer_ESRI_satellite

            };

            var capas_offline = {
                '<img src="../resource/image/calles_2020_3.png" /> Calles Capital San Juan': layer_calles_2020_3,
                '<img src="../resource/image/infraestructura_2.png" /> Infraestructura Capital San Juan': layer_infraestructura_2,
                '<img src="../resource/image/espacios_verdes_2020_1.png" /> Espacios Verdes Capital San Juan': layer_espacios_verdes_2020_1,
                '<img src="../resource/image/capital_manzanas_0.png" /> Capital San Juan Manzanas': layer_capital_manzanas_0,
            };

            //@ts-ignore
            L.control.layers(capas_base, capas_offline).addTo(mymapaux);
            //

            //@ts-ignore
            L.Control.Watermark = L.Control.extend({
                onAdd: function(map) {
                    //@ts-ignore
                    var img = L.DomUtil.create('img');

                    img.src = '../resource/image/logo-gobierno.png';
                    img.style.width = '250px';

                    return img;
                },

                onRemove: function(map) {

                }
            });

            //@ts-ignore
            L.control.watermark = function(opts) {
                //@ts-ignore
                return new L.Control.Watermark(opts);
            }
            //@ts-ignore
            L.control.watermark({ position: 'bottomright' }).addTo(mymapaux);

/////////////

            //@ts-ignore
           // setBounds();
            var i = 0;
            layer_calles_2020_3.eachLayer(function(layer) {
                var context = {
                    feature: layer.feature,
                    variables: {}
                };
                //@ts-ignore
                layer.bindTooltip((layer.feature.properties['nombre_cal'] !== null?String('<div style="color: #000000; font-size: 8pt; font-family: \'MS Shell Dlg 2\', sans-serif;">' + layer.feature.properties['nombre_cal']) + '</div>':''), {permanent: true, offset: [-0, -16], className: 'css_calles_2020_3'});
                //@ts-ignore
                labels.push(layer);
                //@ts-ignore
                totalMarkers += 1;
                layer.added = true;
                //@ts-ignore
                addLabel(layer, i);
                i++;
            });
            //@ts-ignore
            resetLabels([layer_calles_2020_3]);
            mymapaux.on("zoomend", function(){
                //@ts-ignore
                resetLabels([layer_calles_2020_3]);
            });
            mymapaux.on("layeradd", function(){
                //@ts-ignore
                resetLabels([layer_calles_2020_3]);
            });
            mymapaux.on("layerremove", function(){
                //@ts-ignore
                resetLabels([layer_calles_2020_3]);
            });
///////////

            //@ts-ignore
            //let testMarker = L.marker([-31.529472, -68.594056]).addTo(this.mymap);
            this.getMyTrees();


            // Try HTML5 geolocation.

            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function(position) {
                    //@ts-ignore
                    let pos = [position.coords.latitude,position.coords.longitude];
                    //@ts-ignore
                    let markerCurrentPos = L.marker(pos).addTo(mymapaux);
                    //@ts-ignore
                    mymapaux.setView(pos,13);
                    markerCurrentPos.bindPopup("Su ubicación actual es " + pos).openPopup();
                }, function() {
                    //this.handleLocationError(true, this.infoWindow, map.getCenter());
                    console.log("error al geolocalizar");
                }, {maximumAge: 0, timeout: 600000, enableHighAccuracy:true} );
            } else {
                // Browser doesn't support Geolocation
                console.log("el browser no soporta geolocalización ");
            }
        },

        getMyTrees (){
            let myTreeList = {};
            if(Connectivity.checkInternetSpeed() == "offline") {
                myTreeList = store.get('get_tree_response');
                console.log("DATA OFFLINE" + JSON.stringify(myTreeList));
                let selected_area = this.searchAndGetParamFromURL("selected_area");
                let selected_square = this.searchAndGetParamFromURL("selected_square");
                let tree_count = myTreeList[0].tree_list.data.area[selected_area].square[selected_square].tree.length;
                for (let i = 0; i < tree_count; i++){
                    try {
                        let latAux = myTreeList[0].tree_list.data.area[selected_area].square[selected_square].tree[i].position.lat;
                        let lngAux = myTreeList[0].tree_list.data.area[selected_area].square[selected_square].tree[i].position.lng;
                        let addresAux = myTreeList[0].tree_list.data.area[selected_area].square[selected_square].tree[i].street + ' - ' + myTreeList[0].tree_list.data.area[selected_area].square[selected_square].tree[i].number;
                        if (latAux != null && lngAux != null) {
                            let positionAux = myTreeList[0].tree_list.data.area[selected_area].square[selected_square].tree[i].position;
                            let nameAux = myTreeList[0].tree_list.data.area[selected_area].square[selected_square].tree[i].name;
                            let treeIDAux = myTreeList[0].tree_list.data.area[selected_area].square[selected_square].tree[i].id;
                            this.my_tree_array.push(positionAux);

                            /*Append elements to list view*/
                            this.listViewElements(positionAux, nameAux, addresAux, treeIDAux);

                            /*Add markers to map view*/
                            this.addMapMarker(positionAux, nameAux, latAux, lngAux, addresAux, treeIDAux);

                            /*This is for getting new map center*/
                            this.setNewCenter(tree_count);

                            /*this is for draw area and square name into page title*/
                            let areaName = myTreeList[0].tree_list.data.area[selected_area].name;
                            let squareName = myTreeList[0].tree_list.data.area[selected_area].square[selected_square].name;
                            document.getElementById("page-title").innerHTML = 'Árboles censados para ' + areaName + ', ' + squareName;
                        } else {
                            console.log('No se considera el marcador porque la longitud o latitud son nulas')
                        }
                    } catch (e) {
                    }
                }
            }else{
                User.getTree().then((response) => {
                    let selected_area = this.searchAndGetParamFromURL("selected_area");
                    let selected_square = this.searchAndGetParamFromURL("selected_square");
                    let tree_count = response.data.tree_list.data.area[selected_area].square[selected_square].tree.length;

                    console.log("selected_area = " + selected_area);
                    console.log("selected_square = " + selected_square);
                    console.log("tree_count = " + tree_count);

                    //console.log("Tree JSON = " + JSON.stringify(response.data.area[selected_area].square[selected_square].tree));

                    for (let i = 0; i < tree_count; i++){
                        try {
                            let latAux = response.data.tree_list.data.area[selected_area].square[selected_square].tree[i].position.lat;
                            let lngAux = response.data.tree_list.data.area[selected_area].square[selected_square].tree[i].position.lng;
                            let addresAux = response.data.tree_list.data.area[selected_area].square[selected_square].tree[i].street + ' - ' + response.data.tree_list.data.area[selected_area].square[selected_square].tree[i].number;
                            if (latAux != null && lngAux != null) {
                                let positionAux = response.data.tree_list.data.area[selected_area].square[selected_square].tree[i].position;
                                let nameAux = response.data.tree_list.data.area[selected_area].square[selected_square].tree[i].name;
                                let treeIDAux = response.data.tree_list.data.area[selected_area].square[selected_square].tree[i].id;
                                this.my_tree_array.push(positionAux);

                                /*Append elements to list view*/
                                this.listViewElements(positionAux, nameAux, addresAux, treeIDAux);

                                /*Add markers to map view*/
                                this.addMapMarker(positionAux, nameAux, latAux, lngAux, addresAux, treeIDAux);

                                /*This is for getting new map center*/
                                this.setNewCenter(tree_count);

                                /*this is for draw area and square name into page title*/
                                let areaName = response.data.tree_list.data.area[selected_area].name;
                                let squareName = response.data.tree_list.data.area[selected_area].square[selected_square].name;
                                document.getElementById("page-title").innerHTML = 'Árboles censados para ' + areaName + ', ' + squareName;
                            } else {
                                console.log('No se considera el marcador porque la longitud o latitud son nulas')
                            }
                        } catch (e) {
                            console.log("Error log trace: " + e.error);
                        }
                    }
                })
                    .catch((err)=>{
                        console.log("error: " + err);
                        //Session.invalidate();
                        //window.location.replace("/");
                    });
            }

        },

         addMapMarker(position, nameAux, lat, lng, address, treeIDAux){
            console.log('ADD MARKER INTO ' + this.mymap);
            if ((lat!=null)&&(lng!=null)){
                console.log("inside the if");
                let auxPosition = [lat, lng];
                let markerAuxLL_content =
                    '<div id="content">'+
                    '<span style="position:relative; float:right"><a href="domicilioACensar.html?arbol_id='+ treeIDAux +
                    '&selected_area='+ this.searchAndGetParamFromURL("selected_area") +
                    '&area_id='+ this.searchAndGetParamFromURL("area_id") +
                    '&selected_square='+ this.searchAndGetParamFromURL("selected_square") +
                    '&square_id='+ this.searchAndGetParamFromURL("square_id") +
                    '&cens_id='+ this.searchAndGetParamFromURL("cens_id") +'"><i class="far fa-edit pl-1" style="color:#18BC9C"></i></a></span>'+
                    '<h6 id="firstHeading" class="map-tooltip-heading">'+
                    nameAux+
                    '</h6>'+
                    '<div>'+
                    '<p><b>'+
                    address +
                    '</div>';

                //@ts-ignore
                let markerAuxLL = new L.marker(auxPosition).addTo(this.mymap).bindPopup(markerAuxLL_content);
         }else{
                console.log('los datos de posición para este marcador no existen o son nulos, se omite su creación.')
            }
        },

        listViewElements(position, treeName, treeAdress, treeIDAux){
            /*Agrego dinámicamente unos divs en la vista de lista.*/
            let listViewLink = 'domicilioACensar.html?arbol_id='+ treeIDAux +
                '&selected_area='+ this.searchAndGetParamFromURL("selected_area") +
                '&area_id='+ this.searchAndGetParamFromURL("area_id") +
                '&selected_square='+ this.searchAndGetParamFromURL("selected_square") +
                '&square_id='+ this.searchAndGetParamFromURL("square_id") +
                '&cens_id='+ this.searchAndGetParamFromURL("cens_id");
            let linkElementAux = document.createElement('a');
            linkElementAux.innerHTML = "<i class='far fa-edit pl-1 style='color:#18BC9C'>"+"</i>" +
                '<strong>'+treeName +'</strong>'+ ' - ' + treeAdress + '-' + JSON.stringify(position);
            linkElementAux.setAttribute('class', 'list-group-item list-group-item-action');
            linkElementAux.setAttribute('href', listViewLink);
            document.getElementById('listview').appendChild(linkElementAux);
        },

        setNewCenter(elements){
            console.log("Setting new map's center");
          let latArrayAux=[];
          let lngArrayAux=[];
          let qElements = elements;
          for (let i = 0; i < qElements; i++) {
                let auxLatValue = this.my_tree_array[i].lat;
                let auxLngValue = this.my_tree_array[i].lng;
                if ((auxLatValue!==null) && (auxLngValue!==null)){
                latArrayAux.push(auxLatValue);
                lngArrayAux.push(auxLngValue);
          }else{console.log('lat or pos null')}
            }
          console.log('ARREGLO DE LATITUDES EN SETNEWCENTER ' + latArrayAux);
          console.log('ARREGLO DE LONGITUDES EN SETNEWCENTER ' + lngArrayAux);
          let maxLat = Math.max.apply(null,latArrayAux);
          let minLat = Math.min.apply(null,latArrayAux);
          let avgLat = (maxLat + minLat)/2;
          let maxLng = Math.max.apply(null,lngArrayAux);
          let minLng = Math.min.apply(null,lngArrayAux);
          let avgLng = (maxLng + minLng)/2;
          let newCenter = [avgLat,avgLng];
          this.mymap.setView(newCenter,8);
        },

        setParamsAndRedirect(selected_area: string, area_id: string, selected_square: string, square_id: string, cens_id: string){
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function(position) {
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

        selectedParams() {
            this.setParamsAndRedirect(this.searchAndGetParamFromURL("selected_area"), this.searchAndGetParamFromURL("area_id"), this.searchAndGetParamFromURL("selected_square"), this.searchAndGetParamFromURL("square_id"), this.searchAndGetParamFromURL("cens_id"));
        },

        goBack(){
            window.location.replace("manzanasCensadas.html?" +
                "selected_area=" + this.searchAndGetParamFromURL("selected_area") +
                "&area_id=" + this.searchAndGetParamFromURL("area_id") +
                "&cens_id=" + this.searchAndGetParamFromURL("cens_id"));
        }
    }
});
