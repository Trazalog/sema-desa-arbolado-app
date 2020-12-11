import '../app';
require('bootstrap');
import * as $ from 'jquery';
import Vue from 'vue';
import MainHeader from '../../../component/main-header.vue';
import VeeValidate, { Validator } from 'vee-validate';
import * as es from 'vee-validate/dist/locale/es';
import { User } from "../model/User";
import { Session } from "../model/Session";
Validator.localize('es', es);
Vue.use(VeeValidate, {
    locale: 'es'
});
var vue = Vue;
new vue({
    el: '#mainMisArbolesCensados',
    components: {
        // @ts-ignore
        MainHeader: MainHeader
    },
    data: {
        my_area_array_names: [],
        my_area_array_ids: [],
        area_index: [],
        cens_id: '',
    },
    created: function () {
        this.getMyAreas();
    },
    mounted: function () {
    },
    methods: {
        getMyAreas: function () {
            var _this = this;
            User.getArea()
                .then(function (response) {
                var area_count = response.data.tree_list.data.area.length;
                var areaArrayAux = [];
                for (var i = 0; i < area_count; i++) {
                    var squareCount = response.data.tree_list.data.area[i].square.length;
                    for (var j = 0; j < squareCount; j++) {
                        var treeCount = response.data.tree_list.data.area[i].square[j].tree.length;
                        var areaAux = response.data.tree_list.data.area[i].name;
                        var areaId = response.data.tree_list.data.area[i].id;
                        if (treeCount > 0 && i === 0) {
                            _this.my_area_array_ids.push(areaId);
                            _this.area_index.push(i);
                            areaArrayAux.push(areaAux);
                        }
                        else if (treeCount > 0 && i > 0 && (areaAux !== _this.my_area_array_names[i - 1])) {
                            console.log(areaAux + ' Debería ser mostrada en pantalla porque tiene ' + treeCount + 'árboles censados');
                            areaArrayAux.push(areaAux);
                            _this.my_area_array_ids.push(areaId);
                            _this.area_index.push(i);
                        }
                        _this.cens_id = response.data.tree_list.data.area[i].cens_id;
                    }
                }
                console.log("antes reduce: " + _this.my_area_array_names);
                _this.my_area_array_names = areaArrayAux.reduce(function (a, b) { if (a.indexOf(b) < 0)
                    a.push(b); return a; }, []);
                console.log("despues reduce: " + _this.my_area_array_names);
                console.log('before ids: ' + _this.my_area_array_ids);
                _this.my_area_array_ids = _this.my_area_array_ids.reduce(function (a, b) { if (a.indexOf(b) < 0)
                    a.push(b); return a; }, []);
                console.log('after ids: ' + _this.my_area_array_ids);
                _this.area_index = _this.area_index.reduce(function (a, b) { if (a.indexOf(b) < 0)
                    a.push(b); return a; }, []);
                // Remove loading
                $(".se-pre-con").fadeOut("slow");
            }).catch(function (err) {
                console.log("error: " + err);
                // Remove loading
                $(".se-pre-con").fadeOut("slow");
                Session.invalidate();
                window.location.replace("/");
            });
        },
        selectedArea: function (index) {
            window.location.replace("manzanasCensadas.html?" +
                "selected_area=" + this.area_index[index] +
                "&area_id=" + this.my_area_array_ids[index] +
                "&cens_id=" + this.cens_id);
        }
    }
});
//# sourceMappingURL=MisArbolesCensadosController.js.map