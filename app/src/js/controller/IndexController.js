import '../app';
import * as $ from 'jquery';
import Vue from 'vue';
import VeeValidate, { Validator } from 'vee-validate';
import * as es from 'vee-validate/dist/locale/es';
import { Session } from "../model/Session";
import { User } from "../model/User";
import { Form } from "../model/Form";
import { Connectivity } from "../model/Connectivity";
import store from "store2";
var CryptoJS = require("crypto-js");
require('bootstrap');
Validator.localize('es', es);
Vue.use(VeeValidate, {
    locale: 'es'
});
var vue = Vue;
new vue({
    el: '#mainLogin',
    data: {
        username: '',
        password: '',
        alert_title: '',
        alert_message: '',
        interval: null,
        connection_quality: ''
    },
    mounted: function () {
        /*if (!Configuration.checkCompatibility()){

            let message = $("#message");

            this.alert_title = "¡Advertencia!";
            this.alert_message = "Tu navegador web " + Configuration.getBrowserName() + " necesita ser actualizado para que puedas usar todas las funciones de la aplicación.";


            message.find(".modal-content").removeClass("modal-warning");
            message.find(".modal-content").addClass("modal-danger");
            (<any>message).modal("show");
        }*/
        var _this = this;
        /* Check connectivity */
        try {
            this.checkNetworkConnection();
            this.interval = setInterval(function () {
                _this.checkNetworkConnection();
            }, 10000);
        }
        catch (e) {
        }
        // Remove loading
        $(".se-pre-con").fadeOut("slow");
    },
    beforeDestroy: function () {
        clearInterval(this.interval);
    },
    methods: {
        validateForm: function () {
            var _this = this;
            this.$validator.validateAll().then(function (isValid) {
                /*** Message modal ***/
                var message = $("#message");
                if (isValid) {
                    _this.$validator.errors.clear();
                    var passwd = null;
                    if (_this.password == "admin")
                        passwd = _this.password;
                    else
                        passwd = CryptoJS.MD5(_this.password).toString();
                    var username_1 = _this.username.toLowerCase().trim();
                    User.login(username_1, passwd)
                        .then(function (response) {
                        if (response.status === 200 || response.status === 201) {
                            /*** JS create session ***/
                            Session.create(username_1, response.data.access_token, response.data.refresh_token, response.data.scope, response.data.token_type, response.data.expires_in);
                            /*Obtenego el form template*/
                            Form.getTemplate().then(function (response) {
                                console.log("Template de formulario " + JSON.stringify(response.data));
                                store.set("formTemplate", response.data);
                                /*** Redirection ***/
                                var url = "home.html";
                                window.location.replace(url);
                            })
                                .catch(function (error) {
                                console.log('Se ha producido un error al obtener el template de formulario.');
                                /*** Redirection ***/
                                var url = "home.html";
                                window.location.replace(url);
                            });
                        }
                        else {
                            /*** Prepare and show message ***/
                            _this.alert_title = "Error en el servidor";
                            _this.alert_message = "Se produjo un problema en el servidor y la respuesta no se pudo obtener.";
                            message.find(".modal-content").removeClass("modal-warning");
                            message.find(".modal-content").addClass("modal-danger");
                            message.modal("show");
                            /*** Clean data entry ***/
                            _this.username = "";
                            _this.password = "";
                            /*** Enable submit again ***/
                            var submit = $("button[type=submit]");
                            /* Disabled */
                            submit.removeAttr("disabled");
                            /* Loading */
                            submit.find("i").removeClass("fa-spinner fa-spin");
                            submit.find("i").addClass("fa-sign-out-alt");
                        }
                    })
                        .catch(function (error) {
                        if (error.response.status === 400) {
                            /*** Prepare and show message ***/
                            _this.alert_title = "Error al iniciar sesión";
                            _this.alert_message = "El usuario o la contraseña no son válidos.";
                            message.find(".modal-content").removeClass("modal-danger");
                            message.find(".modal-content").addClass("modal-warning");
                            message.modal("show");
                            /*** Clean data entry ***/
                            _this.username = "";
                            _this.password = "";
                            /*** Enable submit again ***/
                            var submit = $("button[type=submit]");
                            /* Disabled */
                            submit.removeAttr("disabled");
                            /* Loading */
                            submit.find("i").removeClass("fa-spinner fa-spin");
                            submit.find("i").addClass("fa-sign-out-alt");
                        }
                        else {
                            /*** Prepare and show message ***/
                            _this.alert_title = "Error de comunicación";
                            _this.alert_message = "En estos momento no es posible establecer conexión con el servidor.";
                            message.find(".modal-content").removeClass("modal-warning");
                            message.find(".modal-content").addClass("modal-danger");
                            message.modal("show");
                            /*** Clean data entry ***/
                            _this.username = "";
                            _this.password = "";
                            /*** Enable submit again ***/
                            var submit = $("button[type=submit]");
                            /* Disabled */
                            submit.removeAttr("disabled");
                            /* Loading */
                            submit.find("i").removeClass("fa-spinner fa-spin");
                            submit.find("i").addClass("fa-sign-out-alt");
                        }
                    });
                }
                else {
                    /*** Prepare and show message ***/
                    _this.alert_title = "Error de datos";
                    _this.alert_message = "Debes ingresar un usuario y contraseña válidos.";
                    message.find(".modal-content").removeClass("modal-danger");
                    message.find(".modal-content").addClass("modal-warning");
                    message.modal("show");
                    /*** Enable submit again ***/
                    var submit = $("button[type=submit]");
                    /* Disabled */
                    submit.removeAttr("disabled");
                    /* Loading */
                    submit.find("i").removeClass("fa-spinner fa-spin");
                    submit.find("i").addClass("fa-sign-out-alt");
                    _this.username = "";
                    _this.password = "";
                }
            }).catch(function () {
                _this.$validator.errors.clear();
                /*** Message modal ***/
                var message = $("#message");
                /*** Prepare and show message ***/
                _this.alert_title = "Error de comunicación";
                _this.alert_message = "En estos momento no es posible establecer conexión con el servidor.";
                message.find(".modal-content").removeClass("modal-warning");
                message.find(".modal-content").addClass("modal-danger");
                message.modal("show");
                /*** Clean data entry ***/
                _this.username = "";
                _this.password = "";
                /*** Enable submit again ***/
                var submit = $("button[type=submit]");
                /* Disabled */
                submit.removeAttr("disabled");
                /* Loading */
                submit.find("i").removeClass("fa-spinner fa-spin");
                submit.find("i").addClass("fa-sign-out-alt");
            });
        },
        checkNetworkConnection: function () {
            this.connection_quality = Connectivity.checkInternetSpeed();
            var message_icon = $("#signal");
            switch (this.connection_quality) {
                case "Buena":
                    {
                        message_icon.removeClass("qmedium-icon");
                        message_icon.removeClass("qbad-icon");
                        message_icon.addClass("qgood-icon");
                    }
                    break;
                case "Regular":
                    {
                        message_icon.removeClass("qgood-icon");
                        message_icon.removeClass("qbad-icon");
                        message_icon.addClass("qmedium-icon");
                    }
                    break;
                case "Mala":
                    {
                        message_icon.removeClass("qgood-icon");
                        message_icon.removeClass("qmedium-icon");
                        message_icon.addClass("qbad-icon");
                    }
                    break;
            }
        },
        preventMultiSubmit: function () {
            var submit = $("button[type=submit]");
            /* Disabled */
            submit.attr("disabled", "disabled");
            /* Loading */
            submit.find("i").removeClass("fa-sign-out-alt");
            submit.find("i").addClass("fa-spinner fa-spin");
        },
        showHidePasswordField: function () {
            var password = $("#password");
            var password_show_hide = $("#password_show_hide");
            /* Check status type */
            if (password.attr("type") === "password") {
                /*Change type */
                password.attr("type", "text");
                /* Title */
                password_show_hide.attr("title", "Ocultar contraseña");
                /* Change icon */
                password_show_hide.find("i").removeClass("fa-eye-slash");
                password_show_hide.find("i").addClass("fa-eye");
            }
            else {
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
//# sourceMappingURL=IndexController.js.map