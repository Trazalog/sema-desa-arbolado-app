import '../app';

require('bootstrap');

import * as $ from 'jquery';

import Vue from 'vue';

import MainHeader from '../../../component/main-header.vue';

import VeeValidate, { Validator } from 'vee-validate';

import * as es from 'vee-validate/dist/locale/es';
import axios from "axios";
import {User} from "../model/User";
import * as store from "store2";
import {Session} from "../model/Session";
import {Connectivity} from "../model/Connectivity";
Validator.localize('es', es);

Vue.use(VeeValidate, {
    locale: 'es'
});

let vueAAC: any = Vue;
new vueAAC ({
    el: '#mainAreasAsignadas',
    components: {
        // @ts-ignore
        MainHeader
    },
    data: {
        my_area_array_names:[],
        my_area_array_ids:[],
        cens_id: '',
        area_index: null
    },
    created(){
        this.getMyAreas();
    },
    mounted(){


    },
    methods: {
        getMyAreas (){
            User.getArea().then( (response) => {

                let area_count = response.data.tree_list.data.area.length;

                for (let i = 0; i < area_count; i++){

                    let areaAux = response.data.tree_list.data.area[i].name;

                    let areaId = response.data.tree_list.data.area[i].id;

                    this.my_area_array_names.push(areaAux);
                    this.my_area_array_ids.push(areaId);

                    this.cens_id = response.data.tree_list.data.area[i].cens_id;
                }

                // Remove loading
                $(".se-pre-con").fadeOut("slow");

            }).catch(error=>{
                console.log("error: " + error);

                if (!error.response) {

                    let response = {
                        data: store.get("get_tree_response")
                    };

                    let area_count = response.data.tree_list.data.area.length;

                    for (let i = 0; i < area_count; i++){

                        let areaAux = response.data.tree_list.data.area[i].name;

                        let areaId = response.data.tree_list.data.area[i].id;

                        this.my_area_array_names.push(areaAux);
                        this.my_area_array_ids.push(areaId);

                        this.cens_id = response.data.tree_list.data.area[i].cens_id;
                    }

                    // Remove loading
                    $(".se-pre-con").fadeOut("slow");

                } else {


                    Session.invalidate();

                    window.location.replace("/");
                }
            });
        },
        selectedArea(index: number) {
            window.location.replace("manzanasAsignadas.html?" +
                "selected_area=" + index +
                "&area_id=" + this.my_area_array_ids[index] +
                "&cens_id=" + this.cens_id)
        }
    }
});
