import '../app';

require('bootstrap');

import * as $ from 'jquery';

import Vue from 'vue';

import VeeValidate, { Validator } from 'vee-validate';

import * as es from 'vee-validate/dist/locale/es';

import MainHeader from '../../../component/main-header.vue';

import {Session} from "../model/Session";

import {User} from "../model/User";

let CryptoJS = require("crypto-js");

Validator.localize('es', es);

Vue.use(VeeValidate, {
    locale: 'es'
});

let vue: any = Vue;
new vue ({
    el: '#mainMiPerfil',
    components: {
        // @ts-ignore
        MainHeader
    },
    data: {
        alert_title: '',
        alert_message: '',
        username: Session.getSessionUsername(),
        full_name: '',
        password: '',
        email: '',
        phone: '',
        picture: '../../resource/image/default-profile-img.png'
    },
    mounted(){

        /*** Message modal ***/
        let message = $("#message");


        User.getProfile().then(response => {

            if (response.status === 200) {

                /* Creo un objeto usuario y le asigno la respuesta del servicio */
                let user = new User(
                    response.data.usuario.nom_usuario + " " + response.data.usuario.ape_usuario,
                    response.data.usuario.email,
                    response.data.usuario.telefono,
                    this.picture);


                /* Hago uso del objeto en memoria y mediante getter o setter obtengo los datos para actualizar los campos Vue */
                this.full_name = user.full_name;
                this.email = user.email;
                this.phone = user.phone;
                this.picture = user.picture;


            } else {

                /*** Prepare and show message ***/
                this.alert_title = "Error de datos";
                this.alert_message = "No se pudieron obtener los datos de tu perfil.";


                message.find(".modal-content").removeClass("modal-danger");
                message.find(".modal-content").removeClass("modal-success");
                message.find(".modal-content").addClass("modal-warning");
                (<any>message).modal("show");

            }


        }).catch(error => {

            if (error.response.status === 401) {

                Session.invalidate();

                window.location.replace("/");
            }

            /*** Prepare and show message ***/
            this.alert_title = "Error de comunicación";
            this.alert_message = "En estos momento no es posible establecer conexión con el servidor.";


            message.find(".modal-content").removeClass("modal-warning");
            message.find(".modal-content").removeClass("modal-success");
            message.find(".modal-content").addClass("modal-danger");
            (<any>message).modal("show");

        });


        // Remove loading
        $(".se-pre-con").fadeOut("slow");
    },
    methods: {
        validateForm: function () {
            this.$validator.validateAll().then(isValid => {

                /*** Message modal ***/
                let message = $("#message");

                if (isValid) {

                    /* Crear nuevo obj User */
                    let user = new User(this.full_name, this.email, this.phone, this.picture);

                    /* Set old and new password */
                    if (this.password.length > 0)
                        user.password = this.password;
                    else
                        user.password = CryptoJS.MD5(this.password).toString();

                    let username = Session.getSessionUsername();

                    let nombre = this._full_name.split(" ")[0];
                    let apellido = this._full_name.split(" ")[1];

                    let data = {
                        "_post_perfil":{
                            "nombre": nombre,
                            "apellido": apellido,
                            "direccion": "",
                            "telefono": user.phone,
                            "nick": username,
                            "email": user.email,
                            "foto": user.picture,
                            "pass": user.password
                        }
                    };

                    /* Enviar datos actualizados */
                    user.updateProfile(data)
                        .then(response => {

                        if (response.data.profile.status === "success") {

                            /*** Prepare and show message ***/
                            this.alert_title = "¡Excelente!";
                            this.alert_message = "Se pudo guardar los datos de tu perfil exitosamente.";


                            message.find(".modal-content").removeClass("modal-warning");
                            message.find(".modal-content").removeClass("modal-danger");
                            message.find(".modal-content").addClass("modal-success");
                            (<any>message).modal("show");


                            /*** Enable submit again ***/
                            let submit = $("button[type=submit]");

                            /* Disabled */
                            submit.removeAttr("disabled");

                            /* Loading */
                            submit.find("i").removeClass("fa-spinner fa-spin");
                            submit.find("i").addClass("fa-sign-out-alt");


                            /* Redirect to home */
                            message.on('hidden.bs.modal', function () {

                                window.location.replace("home.html");
                            })

                        } else {

                            /*** Prepare and show message ***/
                            this.alert_title = "Error de datos";
                            this.alert_message = "No se pudieron guardar los datos de tu perfil.";


                            message.find(".modal-content").removeClass("modal-danger");
                            message.find(".modal-content").removeClass("modal-success");
                            message.find(".modal-content").addClass("modal-warning");
                            (<any>message).modal("show");


                            /*** Enable submit again ***/
                            let submit = $("button[type=submit]");

                            /* Disabled */
                            submit.removeAttr("disabled");

                            /* Loading */
                            submit.find("i").removeClass("fa-spinner fa-spin");
                            submit.find("i").addClass("fa-sign-out-alt");
                        }


                    }).catch(error => {

                        if (error.response.status === 401) {

                            Session.invalidate();

                            window.location.replace("/");
                        }


                        /*** Prepare and show message ***/
                        this.alert_title = "Error de comunicación";
                        this.alert_message = "En estos momento no es posible establecer conexión con el servidor.";


                        message.find(".modal-content").removeClass("modal-warning");
                        message.find(".modal-content").removeClass("modal-success");
                        message.find(".modal-content").addClass("modal-danger");
                        (<any>message).modal("show");


                        /*** Enable submit again ***/
                        let submit = $("button[type=submit]");

                        /* Disabled */
                        submit.removeAttr("disabled");

                        /* Loading */
                        submit.find("i").removeClass("fa-spinner fa-spin");
                        submit.find("i").addClass("fa-sign-out-alt");
                    });


                } else {

                /*** Prepare and show message ***/
                this.alert_title = "Error de datos";
                this.alert_message = "Por favor revisa todos los campos con error.";


                message.find(".modal-content").removeClass("modal-danger");
                message.find(".modal-content").removeClass("modal-success");
                message.find(".modal-content").addClass("modal-warning");
                (<any>message).modal("show");


                /*** Enable submit again ***/
                let submit = $("button[type=submit]");

                /* Disabled */
                submit.removeAttr("disabled");

                /* Loading */
                submit.find("i").removeClass("fa-spinner fa-spin");
                submit.find("i").addClass("fa-sign-out-alt");
            }

            }).catch(() => {

                this.$validator.errors.clear();
            });
        },
        openFileBox() {

            /*** Open file dialog ***/
            $("#picture_input").trigger("click");


        },
        setImagePicture(event: any) {

            // event.target.files[0].size <= 2097152 bytes = 2 MB.
            if (event.target.files && event.target.files[0] && event.target.files[0].size <= 2097152) {

                let reader = new FileReader();

                reader.onload = (event: any) => {

                    /*** Set base64 ***/
                    this.picture = event.target.result;


                    /*** Validate is an image or not ***/
                    if(this.picture.indexOf("data:image/png;base64") === -1 &&
                       this.picture.indexOf("data:image/jpg;base64") === -1 &&
                       this.picture.indexOf("data:image/jpeg;base64") === -1 &&
                       this.picture.indexOf("data:image/bmp;base64") === -1 &&
                       this.picture.indexOf("data:image/gif;base64") === -1 &&
                       this.picture.indexOf("data:image/svg;base64") === -1 &&
                       this.picture.indexOf("data:image/tiff;base64") === -1) {

                        /*** Not image, remove broken ***/
                        this.removeImagePicture();

                    } else {

                        $("#btn_remove_picture").removeAttr("hidden");
                    }
                };

                reader.readAsDataURL(event.target.files[0]);
            }
        },
        removeImagePicture() {

            this.picture = '../../resource/image/default-profile-img.png';

            $("#picture_input").val("");
            $("#btn_remove_picture").attr("hidden", "hidden");
        },
        preventMultiSubmit() {

            let submit = $("button[type=submit]");

            /* Disabled */
            submit.attr("disabled", "disabled");

            /* Loading */
            submit.find("i").removeClass("fa-sign-out-alt");
            submit.find("i").addClass("fa-spinner fa-spin");

        },
        showHidePasswordField_1() {

            let password = $("#password");
            let password_show_hide = $("#password_show_hide_1");

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
        },
        showHidePasswordField_2() {

            let password = $("#retry_password");
            let password_show_hide = $("#password_show_hide_2");

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