import '../app';
require('bootstrap');
import * as $ from 'jquery';
import Vue from 'vue';
import MainHeader from '../../../component/main-header.vue';
import VeeValidate, { Validator } from 'vee-validate';
import * as es from 'vee-validate/dist/locale/es';
import { Connectivity } from "../model/Connectivity";
//import llmap from '../../../component/llmap.vue';
Validator.localize('es', es);
Vue.use(VeeValidate, {
    locale: 'es'
});
/* importante que sea global */
var map;
var vue = Vue;
var vue1 = new vue({
    el: '#mainNuevaUbicacion',
    components: {
        // @ts-ignore
        MainHeader: MainHeader,
    },
    data: {
        //        infoWindow: null,
        //        my_tree_array: [],
        my_position: {
            lat: null,
            lng: null
        },
        my_llPosition: [],
    },
    mounted: function () {
        if (Connectivity.checkInternetSpeed() !== "offline")
            this.initMap();
        $(".se-pre-con").fadeOut("slow"); // Remove loading
    },
    methods: {
        initMap: function () {
            // Try HTML5 geolocation. - this stays for calculate parameters to send to next screen
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function (position) {
                    var pos = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };
                    vue1.$data.my_position.lat = pos.lat,
                        vue1.$data.my_position.lng = pos.lng,
                        vue1.$data.my_llPosition.push(vue1.$data.my_position.lat);
                    vue1.$data.my_llPosition.push(vue1.$data.my_position.lng);
                    var auxDomObj = document.getElementById("mapid");
                    //@ts-ignore
                    var mymap = L.map(auxDomObj).setView(vue1.$data.my_llPosition, 18); //Max-18 here i should change the integer of second parameter. higher values means more detailed map. Check
                    //@ts-ignore
                    mymap.attributionControl.addAttribution('Secretaria de Estado de Ambiente y Desarrollo Sustentable. Gobierno de San Juan. Argentina');
                    //@ts-ignore
                    //  var bounds_group = new L.featureGroup([]);
                    //    function setBounds() {
                    //    }
                    //@ts-ignore
                    var osm = L.tileLayer('https://{s}.tile.osm.org/{z}/{x}/{y}.png', {
                        attribution: ''
                    }).addTo(mymap);
                    //@ts-ignore
                    var osm_bn = L.tileLayer('https://tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png', {
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
                    //@ts-ignore
                    var markerCurrentPos = L.marker(vue1.$data.my_llPosition, { draggable: 'true', autoPan: true }).addTo(mymap);
                    markerCurrentPos.bindPopup("Su ubicación actual").openPopup();
                    markerCurrentPos.on('dragend', function (event) {
                        var marker = event.target;
                        var manualPosition = markerCurrentPos.getLatLng();
                        console.log("Nueva posición => " + manualPosition);
                        console.log("SI COMPILE");
                        markerCurrentPos.setLatLng(manualPosition, { draggable: 'true', autoPan: true }).bindPopup(vue1.$data.my_llPosition).update();
                        //Actualizo los datos de lat y long en la variable para ser enviados hacia los siguientes formularios
                        vue1.$data.my_position.lat = manualPosition.lat;
                        vue1.$data.my_position.lng = manualPosition.lng;
                    });
                    ////////////////////
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
                        };
                    }
                    mymap.createPane('pane_capital_manzanas_0');
                    mymap.getPane('pane_capital_manzanas_0').style.zIndex = 400;
                    mymap.getPane('pane_capital_manzanas_0').style['mix-blend-mode'] = 'normal';
                    //@ts-ignore
                    var layer_capital_manzanas_0 = new L.geoJson(json_capital_manzanas_0, {
                        attribution: '<a href=""></a>',
                        pane: 'pane_capital_manzanas_0',
                        style: style_capital_manzanas_0_0,
                    });
                    //@ts-ignore
                    //  bounds_group.addLayer(layer_capital_manzanas_0);
                    mymap.addLayer(layer_capital_manzanas_0);
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
                        };
                    }
                    mymap.createPane('pane_espacios_verdes_2020_1');
                    mymap.getPane('pane_espacios_verdes_2020_1').style.zIndex = 401;
                    mymap.getPane('pane_espacios_verdes_2020_1').style['mix-blend-mode'] = 'normal';
                    //@ts-ignore
                    var layer_espacios_verdes_2020_1 = new L.geoJson(json_espacios_verdes_2020_1, {
                        attribution: '<a href=""></a>',
                        pane: 'pane_espacios_verdes_2020_1',
                        style: style_espacios_verdes_2020_1_0,
                    });
                    //@ts-ignore
                    //  bounds_group.addLayer(layer_espacios_verdes_2020_1);
                    mymap.addLayer(layer_espacios_verdes_2020_1);
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
                        };
                    }
                    mymap.createPane('pane_infraestructura_2');
                    mymap.getPane('pane_infraestructura_2').style.zIndex = 402;
                    mymap.getPane('pane_infraestructura_2').style['mix-blend-mode'] = 'normal';
                    //@ts-ignore
                    var layer_infraestructura_2 = new L.geoJson(json_infraestructura_2, {
                        attribution: '<a href=""></a>',
                        pane: 'pane_infraestructura_2',
                        style: style_infraestructura_2_0,
                    });
                    //@ts-ignore
                    // bounds_group.addLayer(layer_infraestructura_2);
                    mymap.addLayer(layer_infraestructura_2);
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
                        };
                    }
                    mymap.createPane('pane_calles_2020_3');
                    mymap.getPane('pane_calles_2020_3').style.zIndex = 403;
                    mymap.getPane('pane_calles_2020_3').style['mix-blend-mode'] = 'normal';
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
                    L.control.layers(capas_base, capas_offline).addTo(mymap);
                    //
                    //@ts-ignore
                    L.Control.Watermark = L.Control.extend({
                        onAdd: function (map) {
                            //@ts-ignore
                            var img = L.DomUtil.create('img');
                            img.src = '../resource/image/logo-gobierno.png';
                            img.style.width = '250px';
                            return img;
                        },
                        onRemove: function (map) {
                        }
                    });
                    //@ts-ignore
                    L.control.watermark = function (opts) {
                        //@ts-ignore
                        return new L.Control.Watermark(opts);
                    };
                    //@ts-ignore
                    L.control.watermark({ position: 'bottomright' }).addTo(mymap);
                    /////////////
                    ///////////
                    //@ts-ignore
                    //  setBounds();
                    var i = 0;
                    layer_calles_2020_3.eachLayer(function (layer) {
                        var context = {
                            feature: layer.feature,
                            variables: {}
                        };
                        layer.bindTooltip((layer.feature.properties['nombre_cal'] !== null ? String('<div style="color: #000000; font-size: 8pt; font-family: \'MS Shell Dlg 2\', sans-serif;">' + layer.feature.properties['nombre_cal']) + '</div>' : ''), { permanent: true, offset: [-0, -16], className: 'css_calles_2020_3' });
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
                    resetLabels([layer_calles2020_3]);
                    mymap.on("zoomend", function () {
                        //@ts-ignore
                        resetLabels([layer_calles2020_3]);
                    });
                    mymap.on("layeradd", function () {
                        //@ts-ignore
                        resetLabels([layer_calles2020_3]);
                    });
                    mymap.on("layerremove", function () {
                        //@ts-ignore
                        resetLabels([layer_calles2020_3]);
                    });
                    /////////
                    // Remove loading
                    $(".se-pre-con").fadeOut("slow");
                    console.log("Navigator auto-detected position ==> " + JSON.stringify(pos));
                }, function () {
                    this.handleLocationError(true, this.infoWindow, map.getCenter());
                }, { maximumAge: 0, timeout: 600000, enableHighAccuracy: true });
                //* me traigo lo del componente *//
            }
            else {
                // Browser doesn't support Geolocation
                console.log("Su navegador no soporta geolocalización");
            }
        },
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
        setParamsAndRedirect: function (selected_area, area_id, selected_square, square_id, cens_id) {
            $(".se-pre-con").show();
            window.location.replace("domicilioACensar.html?" +
                "selected_area=" + selected_area +
                "&area_id=" + area_id +
                "&selected_square=" + selected_square +
                "&square_id=" + square_id +
                "&current_lat=" + this.my_position.lat +
                "&current_lng=" + this.my_position.lng +
                "&cens_id=" + cens_id);
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