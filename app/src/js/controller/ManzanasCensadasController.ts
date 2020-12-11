import '../app';

require('bootstrap');

import * as $ from 'jquery';

import Vue from 'vue';

import MainHeader from '../../../component/main-header.vue';

import VeeValidate, { Validator } from 'vee-validate';

import * as es from 'vee-validate/dist/locale/es';
import {User} from "../model/User";
import {Session} from "../model/Session";

Validator.localize('es', es);

Vue.use(VeeValidate, {
    locale: 'es'
});

let vue: any = Vue;
new vue ({
    el: '#mainManzanasCensadas',
    components: {
        // @ts-ignore
        MainHeader
    },
    data: {
        my_area:null,
        my_square:null,
        my_square_array_names:[],
        my_square_array_ids:[],
        my_square_array: []
    },
    created(){
        this.getMySquares();
    },
    mounted(){

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
        getMySquares (){

            User.getSquare().then(response => {

                let area = this.searchAndGetParamFromURL("selected_area");

                let square_count = response.data.tree_list.data.area[area].square.length;

                console.log("cantidad manz: " + square_count);

                if (square_count > 0) {

                    for (let i = 0; i < square_count; i++){

                        if (response.data.tree_list.data.area[area].square[i].tree.length > 0){

                            console.log("manzan name: " + response.data.tree_list.data.area[area].square[i].name);
                            let square_name = response.data.tree_list.data.area[area].square[i].name;
                            let square_id = response.data.tree_list.data.area[area].square[i].id;

                            this.my_square_array_names.push(square_name);
                            this.my_square_array_ids.push(square_id);
                            this.my_square_array.push(i);
                            console.log('ARREGLO DE IDS DE MANZANAS ====> '+this.my_square_array_ids[i]);

                        } else {

                            console.log(" **** Not show because tree empty **** ");
                            console.log("Area value = " + area);
                            console.log("Manzana name = " + response.data.tree_list.data.area[area].square[i].name);
                            console.log("Manzana id = " + response.data.tree_list.data.area[area].square[i].id);
                            console.log("Tree length = " + response.data.tree_list.data.area[area].square[i].tree.length);
                            console.log("Tree array = " + response.data.tree_list.data.area[area].square[i].tree);
                            console.log("Index i = " + i);
                            console.log(" ================== EOM ================== ");

                        }
                    }

                } else {

                    $("h5:first-child").append("<p class=\"text-dark main-font pt-5\">No se encontraron elementos.</p>");
                }

            }).catch((err)=>{

                console.log(err);
                Session.invalidate();

                window.location.replace("/");

            });
        },
        selectedSquare(index: number) {

            window.location.replace("arbolesCensados.html?" +
                "selected_area=" + this.searchAndGetParamFromURL("selected_area") +
                "&area_id=" + this.searchAndGetParamFromURL("area_id") +
                "&selected_square=" + this.my_square_array[index] +
                "&square_id=" + this.my_square_array_ids[index] +
                "&cens_id=" + this.searchAndGetParamFromURL("cens_id"))
        },
        goBack(index: number) {
            window.location.replace("misArbolesCensados.html?" +
                "cens_id=" + this.searchAndGetParamFromURL("cens_id"))
        }
    }
});
