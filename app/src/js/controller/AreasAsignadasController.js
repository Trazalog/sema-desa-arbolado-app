import '../app';
require('bootstrap');
import * as $ from 'jquery';
import Vue from 'vue';
import MainHeader from '../../../component/main-header.vue';
import VeeValidate, { Validator } from 'vee-validate';
import * as es from 'vee-validate/dist/locale/es';
import { User } from "../model/User";
import * as store from "store2";
import { Session } from "../model/Session";
Validator.localize('es', es);
Vue.use(VeeValidate, {
    locale: 'es'
});
var vueAAC = Vue;
new vueAAC({
    el: '#mainAreasAsignadas',
    components: {
        // @ts-ignore
        MainHeader: MainHeader
    },
    data: {
        my_area_array_names: [],
        my_area_array_ids: [],
        cens_id: '',
        area_index: null
    },
    created: function () {
        this.getMyAreas();
    },
    mounted: function () {
    },
    methods: {
        getMyAreas: function () {
            var _this = this;
            User.getArea().then(function (response) {
                var area_count = response.data.tree_list.data.area.length;
                for (var i = 0; i < area_count; i++) {
                    var areaAux = response.data.tree_list.data.area[i].name;
                    var areaId = response.data.tree_list.data.area[i].id;
                    _this.my_area_array_names.push(areaAux);
                    _this.my_area_array_ids.push(areaId);
                    _this.cens_id = response.data.tree_list.data.area[i].cens_id;
                }
                // Remove loading
                $(".se-pre-con").fadeOut("slow");
            }).catch(function (error) {
                console.log("error: " + error);
                if (!error.response) {
                    var response = {
                        data: store.get("get_tree_response")
                    };
                    var area_count = response.data.tree_list.data.area.length;
                    for (var i = 0; i < area_count; i++) {
                        var areaAux = response.data.tree_list.data.area[i].name;
                        var areaId = response.data.tree_list.data.area[i].id;
                        _this.my_area_array_names.push(areaAux);
                        _this.my_area_array_ids.push(areaId);
                        _this.cens_id = response.data.tree_list.data.area[i].cens_id;
                    }
                    // Remove loading
                    $(".se-pre-con").fadeOut("slow");
                }
                else {
                    Session.invalidate();
                    window.location.replace("/");
                }
            });
        },
        selectedArea: function (index) {
            window.location.replace("manzanasAsignadas.html?" +
                "selected_area=" + index +
                "&area_id=" + this.my_area_array_ids[index] +
                "&cens_id=" + this.cens_id);
        }
    }
});
//# sourceMappingURL=AreasAsignadasController.js.map