import '../app';
import * as $ from 'jquery';

import Vue from 'vue';

import VeeValidate, {Validator} from 'vee-validate';

import * as es from 'vee-validate/dist/locale/es';

import {Session} from "../model/Session";

import {User} from "../model/User";

import {Form} from "../model/Form";

import {Connectivity} from "../model/Connectivity";
import store from "store2";

let CryptoJS = require("crypto-js");


require('bootstrap');

Validator.localize('es', es);

Vue.use(VeeValidate, {
    locale: 'es'
});

let vue: any = Vue;
new vue ({
    el: '#mainLogin',
    data: {
        username: '',
        password: '',
        alert_title: '',
        alert_message: '',
        interval: null,
        connection_quality: ''
    },
    mounted() {

        /*if (!Configuration.checkCompatibility()){

            let message = $("#message");

            this.alert_title = "¡Advertencia!";
            this.alert_message = "Tu navegador web " + Configuration.getBrowserName() + " necesita ser actualizado para que puedas usar todas las funciones de la aplicación.";


            message.find(".modal-content").removeClass("modal-warning");
            message.find(".modal-content").addClass("modal-danger");
            (<any>message).modal("show");
        }*/


        /* Check connectivity */
        try {
            this.checkNetworkConnection();

            this.interval = setInterval(() => {
                this.checkNetworkConnection();
            }, 10000);

        } catch (e) {
            
        }


        // Remove loading
        $(".se-pre-con").fadeOut("slow");
    },
    beforeDestroy() {

        clearInterval(this.interval);
    },
    methods: {
        validateForm: function () {
            this.$validator.validateAll().then(isValid => {
                /*** Message modal ***/
                let message = $("#message");
                if (isValid) {
                    this.$validator.errors.clear();
                    let passwd = null;
                    if (this.password == "admin")
                        passwd = this.password;
                    else
                        passwd = CryptoJS.MD5(this.password).toString();
                    let username = this.username.toLowerCase().trim();
                    User.login(username, passwd)
                        .then( response => {
                            if (response.status === 200 || response.status === 201) {
                                /*** JS create session ***/
                                Session.create(
                                    username,
                                    response.data.access_token,
                                    response.data.refresh_token,
                                    response.data.scope,
                                    response.data.token_type,
                                    response.data.expires_in
                                );
                                /*Obtenego el form template*/
                                Form.getTemplate().then(response =>{
                                    console.log("Template de formulario " + JSON.stringify(response.data));
                                    store.set("formTemplate", response.data);
                                    /*** Redirection ***/
                                    let url = "home.html";
                                    window.location.replace(url);
                                })
                                    .catch(error=>{
                                        console.log('Se ha producido un error al obtener el template de formulario.')
                                        /*** Redirection ***/
                                        let url = "home.html";
                                        window.location.replace(url);
                                    });


                            } else {
                                /*** Prepare and show message ***/
                                this.alert_title = "Error en el servidor";
                                this.alert_message = "Se produjo un problema en el servidor y la respuesta no se pudo obtener.";
                                message.find(".modal-content").removeClass("modal-warning");
                                message.find(".modal-content").addClass("modal-danger");
                                (<any>message).modal("show");
                                /*** Clean data entry ***/
                                this.username = "";
                                this.password = "";
                                /*** Enable submit again ***/
                                let submit = $("button[type=submit]");
                                /* Disabled */
                                submit.removeAttr("disabled");
                                /* Loading */
                                submit.find("i").removeClass("fa-spinner fa-spin");
                                submit.find("i").addClass("fa-sign-out-alt");
                            }
                        })
                        .catch(error => {

                            if (error.response.status === 400) {

                                /*** Prepare and show message ***/
                                this.alert_title = "Error al iniciar sesión";
                                this.alert_message = "El usuario o la contraseña no son válidos.";


                                message.find(".modal-content").removeClass("modal-danger");
                                message.find(".modal-content").addClass("modal-warning");
                                (<any>message).modal("show");


                                /*** Clean data entry ***/
                                this.username = "";
                                this.password = "";


                                /*** Enable submit again ***/
                                let submit = $("button[type=submit]");

                                /* Disabled */
                                submit.removeAttr("disabled");

                                /* Loading */
                                submit.find("i").removeClass("fa-spinner fa-spin");
                                submit.find("i").addClass("fa-sign-out-alt");

                            } else {

                                /*** Prepare and show message ***/
                                this.alert_title = "Error de comunicación";
                                this.alert_message = "En estos momento no es posible establecer conexión con el servidor.";


                                message.find(".modal-content").removeClass("modal-warning");
                                message.find(".modal-content").addClass("modal-danger");
                                (<any>message).modal("show");


                                /*** Clean data entry ***/
                                this.username = "";
                                this.password = "";


                                /*** Enable submit again ***/
                                let submit = $("button[type=submit]");

                                /* Disabled */
                                submit.removeAttr("disabled");

                                /* Loading */
                                submit.find("i").removeClass("fa-spinner fa-spin");
                                submit.find("i").addClass("fa-sign-out-alt");


                            }
                        });

                } else {

                    /*** Prepare and show message ***/
                    this.alert_title = "Error de datos";
                    this.alert_message = "Debes ingresar un usuario y contraseña válidos.";


                    message.find(".modal-content").removeClass("modal-danger");
                    message.find(".modal-content").addClass("modal-warning");
                    (<any>message).modal("show");


                    /*** Enable submit again ***/
                    let submit = $("button[type=submit]");

                    /* Disabled */
                    submit.removeAttr("disabled");

                    /* Loading */
                    submit.find("i").removeClass("fa-spinner fa-spin");
                    submit.find("i").addClass("fa-sign-out-alt");


                    this.username = "";
                    this.password = "";
                }

            }).catch(() => {

                this.$validator.errors.clear();

                /*** Message modal ***/
                let message = $("#message");

                /*** Prepare and show message ***/
                this.alert_title = "Error de comunicación";
                this.alert_message = "En estos momento no es posible establecer conexión con el servidor.";


                message.find(".modal-content").removeClass("modal-warning");
                message.find(".modal-content").addClass("modal-danger");
                (<any>message).modal("show");


                /*** Clean data entry ***/
                this.username = "";
                this.password = "";


                /*** Enable submit again ***/
                let submit = $("button[type=submit]");

                /* Disabled */
                submit.removeAttr("disabled");

                /* Loading */
                submit.find("i").removeClass("fa-spinner fa-spin");
                submit.find("i").addClass("fa-sign-out-alt");

            });
        },
        checkNetworkConnection() {

            this.connection_quality = Connectivity.checkInternetSpeed();

            let message_icon = $("#signal");

            switch (this.connection_quality) {

                case "Buena": {

                    message_icon.removeClass("qmedium-icon");
                    message_icon.removeClass("qbad-icon");
                    message_icon.addClass("qgood-icon");

                } break;

                case "Regular":{

                    message_icon.removeClass("qgood-icon");
                    message_icon.removeClass("qbad-icon");
                    message_icon.addClass("qmedium-icon");

                } break;

                case "Mala":{

                    message_icon.removeClass("qgood-icon");
                    message_icon.removeClass("qmedium-icon");
                    message_icon.addClass("qbad-icon");

                } break;
            }

        },
        preventMultiSubmit() {

            let submit = $("button[type=submit]");

            /* Disabled */
            submit.attr("disabled", "disabled");

            /* Loading */
            submit.find("i").removeClass("fa-sign-out-alt");
            submit.find("i").addClass("fa-spinner fa-spin");

        },
        showHidePasswordField() {

            let password = $("#password");
            let password_show_hide = $("#password_show_hide");

            /* Check status type */
            if (password.attr("type") === "password") {

                /*Change type */
                password.attr("type", "text");

                /* Title */
                password_show_hide.attr("title", "Ocultar contraseña");

                /* Change icon */
                password_show_hide.find("i").removeClass("fa-eye-slash");
                password_show_hide.find("i").addClass("fa-eye");


            } else {

                /*Change type */
                password.attr("type", "password");

                /* Title */
                password_show_hide.attr("title", "Mostrar contraseña");

                /* Change icon */
                password_show_hide.find("i").removeClass("fa-eye");
                password_show_hide.find("i").addClass("fa-eye-slash");

            }
        }
    }
});
