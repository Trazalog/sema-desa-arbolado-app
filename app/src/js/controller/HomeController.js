import '../app';
require('bootstrap');
import Vue from 'vue';
import MainHeader from '../../../component/main-header.vue';
import * as $ from "jquery";
import { User } from "../model/User";
import store from "store2";
import { Form } from "../model/Form";
import { Connectivity } from "../model/Connectivity";
var vue = Vue;
new vue({
    el: '#mainHome',
    components: {
        // @ts-ignore
        MainHeader: MainHeader
    },
    data: {},
    mounted: function () {
        /* Get tree list and store response for offline consultation */
        User.getArea().then(function (response) {
            store.add("get_tree_response", response.data);
        }).catch(function (error) {
            console.log(error);
        });
        // Remove loading
        $(".se-pre-con").fadeOut("slow");
    },
    methods: {
        syncLocalToServer: function () {
            if (Connectivity.checkInternetSpeed() !== "offline") {
                if (store.has("offline_form_data")) {
                    alert("Sincronizando los datos, cierre este mensaje y aguarde hasta el aviso de finalización.");
                    var offline_form_data = store.get("offline_form_data");
                    console.log(offline_form_data);
                    Form.sendDynamicFormDataOffline(offline_form_data, "POST")
                        .then(function (response) {
                        if (response.status >= 200 && response.status < 300) {
                            alert("¡Excelente todos sus datos offline fueron correctamente enviados al servidor!");
                            store.remove("offline_form_data");
                        }
                    }).catch(function (error) {
                        alert("La sincronización ha fallado intente mas tarde.");
                        console.log(error);
                    });
                }
                else {
                    alert("¡Está todo al día! no hay datos almacenados offline que se necesiten sincronizar.");
                }
            }
            else {
                alert("Aun no tienes conexión a internet, no puedes sincronizar, asegurate de tener conectividad a internet.");
            }
        }
    }
});
//# sourceMappingURL=HomeController.js.map