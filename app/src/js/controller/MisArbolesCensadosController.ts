import '../app';

require('bootstrap');

import * as $ from 'jquery';

import axios from 'axios';

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
    el: '#mainMisArbolesCensados',
    components: {
        // @ts-ignore
        MainHeader
    },
    data: {
        my_area_array_names:[],
        my_area_array_ids:[],
        area_index: null,
        cens_id: '',
    },
    created(){
        this.getMyAreas();
    },
    mounted(){

    },
    methods:  {
        getMyAreas (){
            User.getArea()
                .then( (response) => {
                    let area_count = response.data.tree_list.data.area.length;
                    let areaArrayAux=[];
                    for (let i = 0; i < area_count; i++){
                        let squareCount = response.data.tree_list.data.area[i].square.length;
                        for (let j=0; j < squareCount ; j++){
                            let treeCount =  response.data.tree_list.data.area[i].square[j].tree.length;
                            let areaAux = response.data.tree_list.data.area[i].name;
                            let areaId = response.data.tree_list.data.area[i].id;
                            if (treeCount > 0 && i===0){
                                this.my_area_array_ids.push(areaId);
                                areaArrayAux.push(areaAux);
                            }else if (treeCount > 0 && i>0 && (areaAux!== this.my_area_array_names[i-1])){
                                console.log(areaAux + ' Debería ser mostrada en pantalla porque tiene ' + treeCount + 'árboles censados');
                                areaArrayAux.push(areaAux);
                                this.my_area_array_ids.push(areaId);
                            }
                            this.cens_id = response.data.tree_list.data.area[i].cens_id;
                        }
                    }

                    console.log("antes reduce: " + this.my_area_array_names);
                    this.my_area_array_names = areaArrayAux.reduce(function(a, b){if(a.indexOf(b)<0)a.push(b);return a;},[]);
                    console.log("despues reduce: " + this.my_area_array_names);

                    console.log('before ids: ' + this.my_area_array_ids);
                    this.my_area_array_ids = this.my_area_array_ids.reduce(function(a, b){if(a.indexOf(b)<0)a.push(b);return a;},[]);
                    console.log('after ids: ' + this.my_area_array_ids);

                    // Remove loading
                    $(".se-pre-con").fadeOut("slow");

            }).catch((err)=>{
                console.log("error: " + err);

                // Remove loading
                $(".se-pre-con").fadeOut("slow");

                Session.invalidate();

                window.location.replace("/");
            });
        },
        selectedArea(index: number) {

            window.location.replace("manzanasCensadas.html?" +
                "selected_area=" + index +
                "&area_id=" + this.my_area_array_ids[index] +
                "&cens_id=" + this.cens_id)
        }
    }
});