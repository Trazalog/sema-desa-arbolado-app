import '../app';

require('bootstrap');

import * as $ from 'jquery';

import Vue from 'vue';
import axios from 'axios';
import MainHeader from '../../../component/main-header.vue';
import {Form} from '../model/Form';
import VeeValidate, { Validator } from 'vee-validate';

import * as es from 'vee-validate/dist/locale/es';
import * as store from "store2";
import {Session} from "../model/Session";
import {Tree} from "../model/Tree";
import {Picture} from "../model/Picture";
import {Connectivity} from "../model/Connectivity";
import {set} from "store2";

Validator.localize('es', es);

Vue.use(VeeValidate, {
    locale: 'es'
});

let vue: any = Vue;
let vue1 = new vue ({
    el: '#mainFormDynamic',
    components: {
        // @ts-ignore
        MainHeader
    },
    data: {
        alert_title: '',
        alert_message: '',
        formElements:[],
        idElements:[],
        selected_area:'',
        area_id: '',
        selected_square:'',
        square_id: '',
        current_lat:'',
        current_lng:'',
        selected_street:'',
        calleOtra:'',
        number:'',
        neighborhood:'',
        taza:'',
        formID:'',
        cens_id: '',
        arrFormTemplate:[],
        tree_id: '',
        audit_lat: '',
        audit_lng: ''

    },
    mounted() {
        $(".se-pre-con").fadeIn("fast");
        //if(Connectivity.checkInternetSpeed() !== "offline") {
            //this.instanceForm(); // Aplica si está ONLINE!!!!!!!!!!!!! NO aplica, porque la instancia se va a crear y guardar cambios contra el nuevo servicio.
        //}

        this.getAuditPosition();
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
                case "form_id": response = searchParams.get('form_id'); break;
                case "tree_id": response = searchParams.get('tree_id'); break;
            }
            return response;
        },

        getAuditPosition(){
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function(position) {
                    let pos = {lat: position.coords.latitude,lng: position.coords.longitude};
                    //this.audit_lat = pos.lat;
                    //this.audit_lng = pos.lng;
                    vue1.$data.audit_lat=pos.lat;
                    vue1.$data.audit_lng=pos.lng;

                    console.log("Posición de auditoría ==> " + JSON.stringify(pos));
                    $(".se-pre-con").fadeOut("slow");
                    //this.initPage();
                    vue1.initPage();
                })
            } else {
                $(".se-pre-con").fadeOut("slow");
                console.log('El navegador no soporta Geolocalización');
            }
        },


        initPage(pos: any) {
            /*ENZO, en la fc getAuditPosition se calcula la posición actual del censista.*/
            //this.getAuditPosition();

            if (this.searchAndGetParamFromURL('taza') == 'Taza con árbol') {
                //$(".se-pre-con").fadeOut("slow");
                let id=parseInt('', 10);
                /*Si estoy editando un árbol busco el parámetro de ID en la URL*/
                this.formID = this.searchAndGetParamFromURL("form_id");
                console.log('New Form ID: ' + this.formID);
                this.getFormElements(this.formID);
            }else{
                //appending photo component
                //this.drawFile();
                //appending buttons to form
                //this.drawButtons();
                //Setting values for params
                this.tree_id = this.searchAndGetParamFromURL("tree_id");
                this.selected_area = this.searchAndGetParamFromURL("selected_area");
                this.area_id = this.searchAndGetParamFromURL("area_id");
                this.square_id = this.searchAndGetParamFromURL("square_id");
                this.current_lat = this.searchAndGetParamFromURL("current_lat");
                this.current_lng = this.searchAndGetParamFromURL("current_lng");
                this.selected_street = this.searchAndGetParamFromURL("selected_street");
                this.calleOtra = this.searchAndGetParamFromURL("calleOtra");
                this.number = this.searchAndGetParamFromURL("number");
                this.neighborhood = this.searchAndGetParamFromURL("neighborhood");
                this.cens_id = this.searchAndGetParamFromURL("cens_id");
                this.taza = this.searchAndGetParamFromURL("taza");
                /*Si estoy editando un árbol busco el parámetro de ID en la URL*/
                this.formID = this.searchAndGetParamFromURL("form_id");
                console.log('New Form ID: ' + this.formID);
                this.getFormElements(this.formID);
            }
        },

    goBack(){
        window.location.replace("domicilioACensar.html?" +
         "selected_area=" + this.searchAndGetParamFromURL('selected_area') +
        "&area_id=" +this.searchAndGetParamFromURL('area_id') +
        "&selected_square=" + this.searchAndGetParamFromURL('selected_square') +
        "&square_id=" + this.searchAndGetParamFromURL('square_id') +
        "&current_lat=" + this.searchAndGetParamFromURL('current_lat') +
        "&current_lng=" + this.searchAndGetParamFromURL('current_lng') +
        "&cens_id=" + this.searchAndGetParamFromURL('cens_id'))+
        "&form_id=" + this.searchAndGetParamFromURL("form_id");
    },



       instanceForm() {
           /*Esto no debe hacerse si se esta editando un arbol treeID not null*/
               if (this.searchAndGetParamFromURL("form_id") == "" || this.searchAndGetParamFromURL("form_id") == null) { /*Si estoy creando un nuevo áborl*/
                   if (this.searchAndGetParamFromURL('taza') == 'Taza con árbol') { /*Si es Taza con árbol creo la instancia de form, sino, no*/
                       /*Se crea la instancia de formulario contra el viejo request_box*/
                       Form.createInstance().then(response => {
                           if (response.status === 401) {
                               let message = $("#message");
                               /*** Prepare and show message ***/
                               vue1.$data.alert_title = "Sesión expirada";
                               vue1.$data.alert_message = "Su sesión ha expirado y ya no es válida.";
                               message.find(".modal-content").removeClass("modal-success");
                               message.find(".modal-content").addClass("modal-warning");
                               (<any>message).modal("show");
                               ////Session.invalidate();
                               //window.location.replace("/");
                           }

                           let id = parseInt(response.data.DATA_SERVICE_REQUEST_BOX_RESPONSE.infos.info_id, 10);
                           console.log('New Form ID instance form: ' + id);
                           this.formID = id;
                           this.getFormElements(id);
                       })
                           .catch(error => {
                               console.log('Error al tratar de instanciar el formulario en el controller' + error);
                               $(".se-pre-con").fadeOut("slow");
                               //Session.invalidate();
                               //window.location.replace("/");
                           })
                   } else {
                       $(".se-pre-con").fadeOut("slow");

                       //appending photo component
                       this.drawFile();
                       //appending buttons to form
                       this.drawButtons();
                       //Setting values for params
                       this.tree_id = this.searchAndGetParamFromURL("tree_id");
                       this.selected_area = this.searchAndGetParamFromURL("selected_area");
                       this.area_id = this.searchAndGetParamFromURL("area_id");
                       this.square_id = this.searchAndGetParamFromURL("square_id");
                       this.current_lat = this.searchAndGetParamFromURL("current_lat");
                       this.current_lng = this.searchAndGetParamFromURL("current_lng");
                       this.selected_street = this.searchAndGetParamFromURL("selected_street");
                       this.calleOtra = this.searchAndGetParamFromURL("calleOtra");
                       this.number = this.searchAndGetParamFromURL("number");
                       this.neighborhood = this.searchAndGetParamFromURL("neighborhood");
                       this.cens_id = this.searchAndGetParamFromURL("cens_id");
                       this.taza = this.searchAndGetParamFromURL("taza");

                   }
               } else {
                    /*Si estoy editando un árbol busco el parámetro de ID en la URL*/
                   this.formID = this.searchAndGetParamFromURL("form_id");
                   console.log('New Form ID: ' + this.formID);
                   this.getFormElements(this.formID);

               }
       },

        getFormElements(form_id:any){

            console.log("form_id referencia de la variable de la funcion : " + form_id);
            $(".se-pre-con").fadeIn("fast");
            console.log('Acabo de entrar en get FormElements');
            //Setting values for params
            this.tree_id = this.searchAndGetParamFromURL("tree_id");
            this.selected_area = this.searchAndGetParamFromURL("selected_area");
            this.area_id = this.searchAndGetParamFromURL("area_id");
            this.square_id = this.searchAndGetParamFromURL("square_id");
            this.current_lat = this.searchAndGetParamFromURL("current_lat");
            this.current_lng = this.searchAndGetParamFromURL("current_lng");
            this.selected_street = this.searchAndGetParamFromURL("selected_street");
            this.calleOtra = this.searchAndGetParamFromURL("calleOtra");
            this.number = this.searchAndGetParamFromURL("number");
            this.neighborhood = this.searchAndGetParamFromURL("neighborhood");
            this.cens_id = this.searchAndGetParamFromURL("cens_id");
            this.taza = this.searchAndGetParamFromURL("taza");
            /*Esto debe ser reemplazado x lo que tenga en el JSON del localstorage.*/

            /*REEMPLZAO LA LLAMADA AXIOS X LA CONSULTA AL LOCAL STORAGE*/
            let itemsCount=0;
            console.log('form_id leído dentro de la fc getFormElements -----  ' + this.formID);
            //let arrFormTemplate;

            if (form_id == '' || form_id == null || form_id == "null") {
                console.log('dentro de getForm Elements, evaluo this.Form ID y obtengo el siguiente valor:' + this.formID);
                /*Si estoy censando un nuevo árbol, uso los campos del localstorage, sino, tengo que obtener la respuesta del servicio para pintar campos y valores del árbol*/
                this.arrFormTemplate = store.get('formTemplate');
                console.log('He asignado this.arrFormTemplate desde el local Storage porque se trata de un nuevo árbol y no una modificación');
            }else{
                /*This is the new part,llevo la llamada Axios a la clase form*/
                console.log('Estoy por llamar a la fc getFormData de la clase Form');


                Form.getFormData(this.formID).then((response) => {
                    console.log("New data from class Form, method getFormData" + JSON.stringify(response.data));
                    this.arrFormTemplate=response.data;
                    console.log('he asignado a la var this.arrFormTemplate, el valor de la respuesta del servicio en getFormData ==>' + JSON.stringify(this.arrFormTemplate));
                }).catch(err => {
                    if (err.response.status === 401) {
                        //Session.invalidate();
                        //window.location.replace("/");
                    }
                    console.log('se ha producido un error mientras se obtiene el formulario');
                    // Remove loading
                    $(".se-pre-con").fadeOut("slow");
                    let message = $("#message");
                    $(".modal-content").removeClass("modal-warning");
                    $(".modal-content").addClass("modal-danger");
                    (<any>message).modal("show");
                });
            }

            setTimeout(() => { /*Este timer está para comprobar si tenemos un error de sincronismo, pero no tendría que ir.*/
            /*Desde acá*/
            console.log("El formulario es: " + this.arrFormTemplate.formulario);
            itemsCount = this.arrFormTemplate.formulario.items.length;
            console.log("La cantidad de ítems del formuario es " + itemsCount);
            for (let i = 0; i < itemsCount; i++){
                //recorro el json y pusheo los tipos de cada elemento dentro de un arreglo
                console.log("TIPO DE ELEM: " + this.arrFormTemplate.formulario.items[i].tipo);
                this.formElements.push(this.arrFormTemplate.formulario.items[i].tipo);
            }
            console.log('Arreglo de tipos' + this.formElements);
            if (this.taza != "Taza con árbol") {
                this.formID = 0;
                //drawing photo component
                this.drawFile();
                //appending buttons to form
                this.drawButtons();
            } else {

                /*Analizo los tipos y llamo a las fc correspondiente*/
                for (let i = 0; i < itemsCount; i++){
                    let id_serial_Aux = this.arrFormTemplate.formulario.items[i].id_serial;
                    let tipo_Aux = this.arrFormTemplate.formulario.items[i].tipo;
                    let deshabilitado_Aux = this.arrFormTemplate.formulario.items[i].deshabilitado;
                    let label_Aux = this.arrFormTemplate.formulario.items[i].label;
                    let requerido_Aux = this.arrFormTemplate.formulario.items[i].requerido;
                    let nombre_Aux = this.arrFormTemplate.formulario.items[i].nombre;
                    let cond_habilitado_Aux = this.arrFormTemplate.formulario.items[i].cond_habilitado;
                    let cond_mostrar_Aux = this.arrFormTemplate.formulario.items[i].cond_mostrar;
                    let name_Aux = this.arrFormTemplate.formulario.items[i].name;
                    let orden_Aux = this.arrFormTemplate.formulario.items[i].orden;
                    let id_Aux = this.arrFormTemplate.formulario.items[i].id;
                    let valores_Aux = this.arrFormTemplate.formulario.items[i].valores.valor;
                    let mostrar_Aux = this.arrFormTemplate.formulario.items[i].mostrar;
                    let actual_value = this.arrFormTemplate.formulario.items[i].valor; /*This is the actualValue for this item*/

                    /*is it a section title?*/
                    if (this.formElements[i]=='titulo'){
                        this.drawTitle(id_serial_Aux, tipo_Aux,deshabilitado_Aux,label_Aux,requerido_Aux,nombre_Aux,cond_habilitado_Aux,cond_mostrar_Aux,name_Aux,orden_Aux,id_Aux,valores_Aux,mostrar_Aux);
                    }
                    /*is it a section sub-title?*/
                    if (this.formElements[i]=='titulo2'){
                        this.drawTitle2(id_serial_Aux, tipo_Aux,deshabilitado_Aux,label_Aux,requerido_Aux,nombre_Aux,cond_habilitado_Aux,cond_mostrar_Aux,name_Aux,orden_Aux,id_Aux,valores_Aux,mostrar_Aux);
                    }
                    /*is it an input?*/
                    if (this.formElements[i]=='input'){
                        this.drawInput(id_serial_Aux, tipo_Aux,deshabilitado_Aux,label_Aux,requerido_Aux,nombre_Aux,cond_habilitado_Aux,cond_mostrar_Aux,name_Aux,orden_Aux,id_Aux,valores_Aux,mostrar_Aux,actual_value);
                    }
                    /*is it an numeric input?*/
                    if (this.formElements[i]=='numerico'){
                        this.drawNumericInput(id_serial_Aux, tipo_Aux,deshabilitado_Aux,label_Aux,requerido_Aux,nombre_Aux,cond_habilitado_Aux,cond_mostrar_Aux,name_Aux,orden_Aux,id_Aux,valores_Aux,mostrar_Aux,actual_value);
                    }
                    /*is it a select?*/
                    if (this.formElements[i]=='select'){
                        //console.log(response.data.formulario.items[i].valores);
                        this.drawSelect(id_serial_Aux, tipo_Aux,deshabilitado_Aux,label_Aux,requerido_Aux,nombre_Aux,cond_habilitado_Aux,cond_mostrar_Aux,name_Aux,orden_Aux,id_Aux,valores_Aux,mostrar_Aux,actual_value);

                    }
                    /*is it an checkbox?*/
                    if (this.formElements[i]=='check'){
                        this.drawCheckBox(id_serial_Aux, tipo_Aux,deshabilitado_Aux,label_Aux,requerido_Aux,nombre_Aux,cond_habilitado_Aux,cond_mostrar_Aux,name_Aux,orden_Aux,id_Aux,valores_Aux,mostrar_Aux,actual_value);
                    }
                    /*is it a radioButton?*/
                    if (this.formElements[i]=='radio'){
                        this.drawRadioButtons(id_serial_Aux, tipo_Aux,deshabilitado_Aux,label_Aux,requerido_Aux,nombre_Aux,cond_habilitado_Aux,cond_mostrar_Aux,name_Aux,orden_Aux,id_Aux,valores_Aux,mostrar_Aux,actual_value);
                    }
                    /*is it a date input?*/
                    if (this.formElements[i]=='date'){
                        this.drawDate(id_serial_Aux, tipo_Aux,deshabilitado_Aux,label_Aux,requerido_Aux,nombre_Aux,cond_habilitado_Aux,cond_mostrar_Aux,name_Aux,orden_Aux,id_Aux,valores_Aux,mostrar_Aux,actual_value);
                    }
                    /*is it a textArea?*/
                    if (this.formElements[i]=='textarea'){
                        this.drawTextArea(id_serial_Aux, tipo_Aux,deshabilitado_Aux,label_Aux,requerido_Aux,nombre_Aux,cond_habilitado_Aux,cond_mostrar_Aux,name_Aux,orden_Aux,id_Aux,valores_Aux,mostrar_Aux,actual_value);
                    }
                    /*is it a file?*/
                    if (this.formElements[i]=='file'){
                        this.drawFile(id_serial_Aux, tipo_Aux,deshabilitado_Aux,label_Aux,requerido_Aux,nombre_Aux,cond_habilitado_Aux,cond_mostrar_Aux,name_Aux,orden_Aux,id_Aux,valores_Aux,mostrar_Aux,actual_value);
                    }
                }
                //drawing photo component
                this.drawFile();
                //appending buttons to form
                this.drawButtons();
            }
                $(".se-pre-con").fadeOut("slow");
           /*Hasta acá, sacar de la llamada axios a la función general*/
            }, 3000);  /*Este delay está para comprobar que tenemos un problema de sincronismo*/


        },
        drawTitle(id_serial, tipo,deshabilitado,label,requerido,nombre,cond_habilitado,cond_mostrar,name,orden,id,valores,mostrar){
            //console.log('item is a title='+tipo);
            let newTitle = document.createElement('h5');
            newTitle.innerText =label;
            newTitle.setAttribute('class','text-success main-font mt-4');
            document.getElementById('treeForm').appendChild(newTitle);
        },
        drawTitle2(id_serial, tipo,deshabilitado,label,requerido,nombre,cond_habilitado,cond_mostrar,name,orden,id,valores,mostrar){
            //console.log('item is a title='+tipo);
            let newTitle = document.createElement('h6');
            newTitle.innerText =label;
            newTitle.setAttribute('class','text-success main-font mt-3');
            document.getElementById('treeForm').appendChild(newTitle);
        },
        drawSelect(id_serial, tipo,deshabilitado,label,requerido,nombre,cond_habilitado,cond_mostrar,name,orden,id,valores,mostrar,actual_value){
            //console.log('funcion drawSelect');
            console.log("Valor actual = "+actual_value);
            let newSelectLabel = document.createElement('label');
            newSelectLabel.setAttribute('for',name);
            newSelectLabel.setAttribute('class', 'col-12 text-primary text-left ml-0 mt-2 pb-0 mb-0');
            newSelectLabel.setAttribute('style', 'padding-left: 0px !important;');
            newSelectLabel.innerHTML=label;

            let newSelect = document.createElement('select');
            newSelect.setAttribute('class', 'form-control mt-1 arboSelect');
            newSelect.setAttribute('name',name);
            newSelect.setAttribute('id',name);
            newSelect.setAttribute('value', actual_value);
            if (requerido=='true'){
                //newSelect.setAttribute('required', 'required');
                newSelect.required=true;
            }
            //console.log('valores a json: '+JSON.stringify(valores));

            let optionsCount = valores.length;
            //console.log('Cantidad de opciones para este ítem:=============>'+optionsCount);

            let LabelOption = document.createElement('option');

            //Agrego una opción estática para mostrarla a modo de placeholder
            let placeHolderOption= document.createElement('option');
            placeHolderOption.text="Seleccione la opción deseada";

            /*Seteo el placeholder solo si no tengo valor para este campo*/
            console.log('actual value 2' + actual_value);
            if ((actual_value===null) || (actual_value==="")|| (actual_value==="null")){
            newSelect.setAttribute('value',"");
            placeHolderOption.setAttribute('selected', 'selected');
            }else{newSelect.setAttribute('value',"actual_value");}
            newSelect.appendChild(placeHolderOption);

            for (let i=0;i < optionsCount;i++){
                let valueAux= valores[i].value;
                let newOption = document.createElement('option');
                newOption.setAttribute('value',valueAux);
                newOption.setAttribute('class','arboSelectOption');
                newOption.text=valueAux;
                console.log('Actual value dentro del for' + actual_value)
                if (actual_value!==null && actual_value==valueAux){
                    newOption.setAttribute('selected', 'selected');
                }
                newSelect.appendChild(newOption);
            }
            document.getElementById('treeForm').appendChild(newSelectLabel);
            document.getElementById('treeForm').appendChild(newSelect);

            this.idElements.push(name);

        },
        drawInput(id_serial, tipo,deshabilitado,label,requerido,nombre,cond_habilitado,cond_mostrar,name,orden,id,valores,mostrar,actual_value){
            let newInput = document.createElement('input');
            if (requerido=='true'){
                //newInput.setAttribute('required','true');
                newInput.required=true;
            }

            newInput.setAttribute('id',name);
            newInput.setAttribute('name',name);
            //newInput.innerText =label;
            if(actual_value!="" && actual_value!=null ){
                newInput.value =actual_value;
            }else{newInput.setAttribute('placeholder','Ingrese ' + label);}

            newInput.setAttribute('class','form-control mt-1');
            //newInput.setAttribute('placeholder',label);
            //document.body.appendChild(newTitle);
            let newInputLabel = document.createElement('label');
            newInputLabel.setAttribute('for',name);
            newInputLabel.setAttribute('class', 'col-12 text-primary text-left ml-0 mt-2 pb-0 mb-0');
            newInputLabel.setAttribute('style', 'padding-left: 0px !important;');
            newInputLabel.innerHTML=label;
            document.getElementById('treeForm').appendChild(newInputLabel);
            document.getElementById('treeForm').appendChild(newInput);
            this.idElements.push(name);
        },
        drawNumericInput(id_serial, tipo,deshabilitado,label,requerido,nombre,cond_habilitado,cond_mostrar,name,orden,id,valores,mostrar,actual_value){
            let newNInput = document.createElement('input');
            if (requerido=='true'){
                //newNInput.setAttribute('required', 'required');
                newNInput.required=true;
            }
            if(actual_value!="" && actual_value!=null ){
                newNInput.value =actual_value;
            }else{newNInput.setAttribute('placeholder','Ingrese ' + label);}

            newNInput.setAttribute('id',name);
            newNInput.setAttribute('name',name);
            newNInput.setAttribute('type','number');
            newNInput.innerText =label;
            newNInput.setAttribute('class','form-control mt-1');
            //newNInput.setAttribute('placeholder',label);
            let newNumInputLabel = document.createElement('label');
            newNumInputLabel.setAttribute('for',name);
            newNumInputLabel.setAttribute('class', 'col-12 text-primary text-left ml-0 mt-2 pb-0 mb-0');
            newNumInputLabel.setAttribute('style', 'padding-left: 0px !important;');
            newNumInputLabel.innerHTML=label;
            document.getElementById('treeForm').appendChild(newNumInputLabel);
            document.getElementById('treeForm').appendChild(newNInput);
            this.idElements.push(name);
        },
        drawCheckBox(id_serial, tipo,deshabilitado,label,requerido,nombre,cond_habilitado,cond_mostrar,name,orden,id,valores,mostrar,actual_value){
            let newDivAux = document.createElement('div');
            newDivAux.setAttribute('class', 'form-control text-left mt-2 pl-0');
            newDivAux.setAttribute('id',id_serial+'-container');
            let newCheckBox = document.createElement('input');
            if (requerido=='true'){
                //newCheckBox.setAttribute('required', 'required');
                newCheckBox.required=true;
            }
            newCheckBox.setAttribute('id',name);
            newCheckBox.setAttribute('type', 'checkbox');
            newCheckBox.setAttribute('name',name);
            //newCheckBox.setAttribute('value',name);
            newCheckBox.setAttribute('class','form-check-input ml-2 arbocheck');
            let newLabelAux=document.createElement('label');
            newLabelAux.setAttribute('for', id_serial);
            newLabelAux.setAttribute('class','form-check-label ml-4');
            newLabelAux.innerHTML=label;
            newDivAux.appendChild(newCheckBox);
            newDivAux.appendChild(newLabelAux);
            if (actual_value === name){
                newCheckBox.setAttribute('value',name);
                newCheckBox.checked=true;
            }else{
                newCheckBox.setAttribute('value',"");
                newCheckBox.checked=false;
            }

            document.getElementById('treeForm').appendChild(newDivAux);
            this.idElements.push(name);
        },
        drawTextArea(id_serial, tipo,deshabilitado,label,requerido,nombre,cond_habilitado,cond_mostrar,name,orden,id,valores,mostrar,actual_value){
            //console.log('drawTextArea function');
            let newDiv = document.createElement('div');
            newDiv.setAttribute('class', 'form-group mt-2');
            newDiv.setAttribute('id',name+'-container');
            newDiv.setAttribute('name',name+'-container');
            let newLabel=document.createElement('label');
            newLabel.setAttribute('for',name+'-container');
            newLabel.setAttribute('class', 'input-group-text mt-2');
            newLabel.innerText=label;
            let newTextArea = document.createElement('textarea');

            if(actual_value!="" && actual_value!=null ){
                newTextArea.innerHTML =actual_value;
            }else{newTextArea.setAttribute('placeholder','Ingrese ' + label);}

            if (requerido=='true'){
                //newTextArea.setAttribute('required', 'required');
                newTextArea.required=true;
            }
            newTextArea.setAttribute('class','form-control');
            newTextArea.setAttribute('id', name);
            newTextArea.setAttribute('name', name);
            newDiv.appendChild(newLabel);
            newDiv.appendChild(newTextArea);
            document.getElementById('treeForm').appendChild(newDiv);
            this.idElements.push(name);
        },
        drawRadioButtons(id_serial, tipo,deshabilitado,label,requerido,nombre,cond_habilitado,cond_mostrar,name,orden,id,valores,mostrar,actual_value){
            //console.log('drawRadioButtons function');
            let newformGroup = document.createElement('div');
            newformGroup.setAttribute('id',id_serial+'-maincontainer');
            newformGroup.setAttribute('class','form-gorup mt-2');
            let newgroupTitle = document.createElement('span');
            newgroupTitle.setAttribute('id',id_serial+'-group');
            newgroupTitle.setAttribute('class','input-group-text col-12');
            if (JSON.stringify(valores)!="")
            {
                console.log('no hay opciones para mostrar dentro del select '+ id_serial);
                newformGroup.appendChild(newgroupTitle);
            }
            else {
                let optionsCount = valores.valor.length;
                for (let i=0;i < optionsCount;i++){
                    let optionAux= valores.valor[i].value;
                    let newOptionGroup = document.createElement('div');
                    newOptionGroup.setAttribute('class','form-check');
                    newOptionGroup.setAttribute('id', id_serial+'_optiongroup');

                    let newOptionInput = document.createElement('input');
                    newOptionInput.setAttribute('id', id_serial);
                    newOptionInput.setAttribute('name',id_serial);
                    newOptionInput.setAttribute('type','radio');
                    newOptionInput.setAttribute('value',optionAux);

                    let newOptionLabel = document.createElement('label');
                    newOptionLabel.innerText=optionAux;
                    newOptionLabel.setAttribute('for',id_serial);

                    newOptionGroup.appendChild(newOptionInput);
                    newOptionGroup.appendChild(newOptionLabel);
                    newformGroup.appendChild(newOptionGroup);
                }
                document.getElementById('treeForm').appendChild(newformGroup);
                this.idElements.push(name);

            }


        },
        drawFile(){
   //         console.log('drawFile function');
            let newMainFileDiv = document.createElement('div');
            newMainFileDiv.setAttribute('class','row');
            let newHeaderContainer = document.createElement('div');
            newHeaderContainer.setAttribute('class', 'profile-header-container');
            newMainFileDiv.appendChild(newHeaderContainer);
            let newImgContainerDiv = document.createElement('div');
            newImgContainerDiv.setAttribute('class', 'profile-header-img');
            newHeaderContainer.appendChild(newImgContainerDiv);
            let takenPic = document.createElement('img');
            takenPic.setAttribute('class', 'img-circle');

            Tree.getPhoto(this.searchAndGetParamFromURL('tree_id'))
                .then(response => {

                    let treePhoto = response.data.imagenes.imagen.replace("dataimage/jpegbase64", "data:image/jpeg;base64,");
                    takenPic.setAttribute('src',treePhoto);

            })
                .catch(error => {
                    takenPic.setAttribute('src', '/resource/image/main-icon.png');
                });

            takenPic.setAttribute('id', 'treePic');
            newImgContainerDiv.appendChild(takenPic);
            let controlDiv = document.createElement('div');
            controlDiv.setAttribute('class', 'rank-label-container');
            controlDiv.innerHTML = '<span class="label label-default rank-label"><i id="foto_init" class="fa fa-camera text-white" @click="openFileBox" style="cursor: pointer"></i></span>';
            newImgContainerDiv.appendChild(controlDiv);
            document.getElementById('treeForm').appendChild(newMainFileDiv);

            /* Input take a picture */
            let take_pic_input = document.createElement('input');

            take_pic_input.setAttribute("id", "picture_input");
            take_pic_input.setAttribute("name", "picture_input");
            take_pic_input.setAttribute("type", "file");
            take_pic_input.setAttribute("accept", "image/*");
            take_pic_input.setAttribute("capture", "");
            take_pic_input.setAttribute("hidden", "hidden");

            newImgContainerDiv.appendChild(take_pic_input);
            document.getElementById('treeForm').appendChild(newMainFileDiv);
        },
        drawButtons(){
            let submitBTN = document.createElement('button');
            submitBTN.setAttribute('type','button');
            submitBTN.setAttribute('id','send_form');
            submitBTN.innerHTML = 'Guardar cambios';
            submitBTN.setAttribute ('class', 'btn btn-success btn-block mt-3');

            let cancelBTN = document.createElement('button');
            cancelBTN.setAttribute('type','button');
            cancelBTN.setAttribute('onclick','window.location.replace(\'home.html\');');
            cancelBTN.innerHTML = 'Cancelar';
            cancelBTN.setAttribute ('class', 'btn btn-secondary btn-block mb-4');

            document.getElementById('treeForm').appendChild(submitBTN);
            document.getElementById('treeForm').appendChild(cancelBTN);
        },
        /*unused functions*/
        drawDate(id_serial, tipo,deshabilitado,label,requerido,nombre,cond_habilitado,cond_mostrar,name,orden,id,valores,mostrar,actual_value){
            console.log('drawDate function');
            let newDivMain = document.createElement('div');
            let newDivInputGroup = document.createElement('div');
            let newInput=document.createElement('input');
            if (requerido=='true'){
                //newInput.setAttribute('required', 'required');
                newInput.required=true;
            }
            newDivInputGroup.innerHTML = '<span class="input-group-text">'+ label+'</span>';
            newDivMain.setAttribute('class','form-gorup');
            newDivInputGroup.setAttribute('class','input-group mt-2');
            newInput.setAttribute('class', 'form-control');
            newInput.setAttribute('name', id_serial);
            newInput.setAttribute('type', 'date');
            newDivInputGroup.appendChild(newInput);
            newDivMain.appendChild(newDivInputGroup);
            document.getElementById('treeForm').appendChild(newDivMain);
            this.idElements.push(id_serial);
        },
    }
});
///*****  para manipular el valor de los checkbox contra evento click.    *****////
    $(document).on('click','.arbocheck',function(){
        let AuxName = $(this).prop("name");
        let AuxValue = $(this).prop("value");
        if($(this).is(":checked")){
            //alert("Checkbox " +  AuxName +" is checked." + AuxValue);
            $(this).attr('value',AuxName);
        }else if($(this).is(":not(:checked)")){
            //alert("Checkbox " +  AuxName +" is unchecked." + AuxValue);
            $(this).attr('value','');
        }
    });
///*****     *****////



///***** para setear el value de un elemento select cuando clickeo uno de los options *****////
$(document).ready(function(){
    console.log('documento listo');
    $(document).on('change', '.arboSelect', function (e) {
        let selected_value=String($(this).children(':selected').val());
        $(this).attr('value',selected_value);
    });
});
////***** *******////


$(document).on('click','#foto_init',function(){
    $("#picture_input").trigger("click");
});

$(document).on('change', '#picture_input', function (event: any) {
    // event.target.files[0].size <= 9997152 bytes = 10 MB.
    if (event.target.files && event.target.files[0] && event.target.files[0].size <= 9997152) {
        let reader = new FileReader();
        reader.onload = (event: any) => {
            /*** Set base64 ***/
            $("#treePic").attr("src", event.target.result);
            //this.picture = event.target.result;
        };
        reader.readAsDataURL(event.target.files[0]);
    }
});

$(document).on('click','#send_form', function(){

    $(".se-pre-con").fadeIn("fast");

    console.log("selected_area: " + vue1.$data.selected_area);
    console.log("selected_square: " + vue1.$data.selected_square);
    console.log("current_lat: " + vue1.$data.current_lat);
    console.log("current_lng: " + vue1.$data.current_lng);
    console.log("selected_street: " + vue1.$data.selected_street);
    console.log("calleOtra: " + vue1.$data.calleOtra);
    console.log("number: " + vue1.$data.number);
    console.log("neighborhood: " + vue1.$data.neighborhood);
    console.log("taza: " + vue1.$data.taza);
    console.log("formID: " + vue1.$data.formID);
    console.log("audit_lat: " + vue1.$data.audit_lat);
    console.log("audit_lng: " + vue1.$data.audit_lng);
    console.log("================================");

    if (vue1.$data.formID == "")
        vue1.$data.formID = "0";

    if ($("#picture_input").val() != "" || $("#treePic").attr("src") != "/resource/image/main-icon.png"){

        if (vue1.$data.taza === "Taza con árbol") {

            let json_array_put = [];

            for (let i = 0; i < vue1.$data.idElements.length; i++){
                json_array_put.push({
                    "info_id": Number(vue1.$data.formID),
                    "valor": $('#' + vue1.$data.idElements[i]).val(),
                    "name": vue1.$data.idElements[i]
                });
            }


            if (Connectivity.checkInternetSpeed() !== "offline") {

                // 3 ALmaceno los datos del árbol y la foto
                let calle = "";
                if (vue1.$data.selected_street === "Otra")
                    calle = vue1.$data.calleOtra;
                else
                    calle = vue1.$data.selected_street;

                let foto_arbol = "";
                if (!$("#treePic").prop("src").includes("/resource/image/main-icon.png"))
                    foto_arbol = $("#treePic").prop("src");
                else
                    foto_arbol = "";


                const offline_form_data = {
                    "_post_arbol_set": {
                        "calle": calle,
                        "altura": vue1.$data.number,
                        "manz_id": vue1.$data.square_id,
                        "nombre": $('#' + vue1.$data.idElements[0]).val(),
                        //"info_id": vue1.$data.formID.toString(),
                        "cens_id": vue1.$data.cens_id,
                        "lat": vue1.$data.current_lat,
                        "long": vue1.$data.current_lng,
                        "lat_gps": vue1.$data.audit_lat.toString(),
                        "long_gps": vue1.$data.audit_lng.toString(),
                        "tipo": "",
                        "imagen": Picture.getBase64AndResizeImage(foto_arbol, 400, 400),
                        "taza": vue1.$data.taza,
                        "barrio": vue1.$data.neighborhood,
                        "_put_formulario_batch_req": {
                            "form_id":"2",
                            "_put_formulario": json_array_put
                        }
                    }
                };

                if (vue1.$data.formID === "0"){

                    Form.sendDynamicFormDataOffline(offline_form_data, "POST")
                        .then(response => {
                            if (response.status >= 200 && response.status < 300) {

                                $(".se-pre-con").fadeOut("slow");


                                let message = $("#message");

                                vue1.$data.alert_title = "¡Excelente!";
                                vue1.$data.alert_message = "Los datos fueron guardados correctamente.";


                                message.find(".modal-content").removeClass("modal-warning");
                                message.find(".modal-content").addClass("modal-success");
                                (<any>message).modal("show");


                                message.on('hidden.bs.modal', function () {

                                    window.location.replace("home.html");
                                });



                                /*
                                Form.sendOnlyTreePicture(data)
                                    .then(response => {

                                        if (response.status === 200) {

                                            $(".se-pre-con").fadeOut("slow");


                                            let message = $("#message");

                                            vue1.$data.alert_title = "¡Excelente!";
                                            vue1.$data.alert_message = "Los datos fueron guardados correctamente.";


                                            message.find(".modal-content").removeClass("modal-warning");
                                            message.find(".modal-content").addClass("modal-success");
                                            (<any>message).modal("show");


                                            message.on('hidden.bs.modal', function () {

                                                window.location.replace("home.html");
                                            });

                                        } else {

                                            $(".se-pre-con").fadeOut("slow");


                                            let message = $("#message");

                                            vue1.$data.alert_title = "Error en el servidor";
                                            vue1.$data.alert_message = "Se produjo un problema en el servidor y no se puedo guardar la foto del árbol.";


                                            message.find(".modal-content").removeClass("modal-success");
                                            message.find(".modal-content").addClass("modal-warning");
                                            (<any>message).modal("show");
                                        }

                                    })
                                    .catch(error => {

                                        if (error.response.status === 401) {

                                            //Session.invalidate();

                                            //window.location.replace("/");
                                        }

                                        $(".se-pre-con").fadeOut("slow");

                                        let message = $("#message");

                                        vue1.$data.alert_title = "Error en el servidor";
                                        vue1.$data.alert_message = "Se produjo un problema en el servidor y no se puedo guardar la foto del árbol.";


                                        message.find(".modal-content").removeClass("modal-success");
                                        message.find(".modal-content").addClass("modal-warning");
                                        (<any>message).modal("show");

                                        console.log(error);
                                    });
                                    */

                            } else {

                                $(".se-pre-con").fadeOut("slow");

                                /*** Message modal ***/
                                let message = $("#message");

                                /*** Prepare and show message ***/
                                vue1.$data.alert_title = "Error en el servidor";
                                vue1.$data.alert_message = "Se produjo un problema en el servidor y la petición no se pudo enviar.";


                                message.find(".modal-content").removeClass("modal-success");
                                message.find(".modal-content").addClass("modal-warning");
                                (<any>message).modal("show");

                            }


                        }).catch(error => {

                        if (error.response.status === 401) {

                            //Session.invalidate();

                            //window.location.replace("/");
                        }

                        $(".se-pre-con").fadeOut("slow");

                        /*** Message modal ***/
                        let message = $("#message");

                        /*** Prepare and show message ***/
                        vue1.$data.alert_title = "Error en el servidor";
                        vue1.$data.alert_message = "Se produjo un problema en el servidor y la petición no se pudo enviar.";


                        message.find(".modal-content").removeClass("modal-success");
                        message.find(".modal-content").addClass("modal-warning");
                        (<any>message).modal("show");

                        console.log(error);
                    });
                }
                else {

                    // PUT editar árbol online!
                    const put_formulario = {
                        "_put_formulario_batch_req": {
                            "_put_formulario": json_array_put
                        }
                    };

                    Form.sendDynamicFormData(put_formulario, "PUT")
                        .then(response => {

                            let calle = "";
                            if (vue1.$data.selected_street === "Otra")
                                calle = vue1.$data.calleOtra;
                            else
                                calle = vue1.$data.selected_street;


                            let foto_arbol = "";
                            if (!$("#treePic").prop("src").includes("/resource/image/main-icon.png"))
                                foto_arbol = $("#treePic").prop("src");
                            else
                                foto_arbol = "";

                            console.log("Arbol ID campo arbo_id (vue1.$data.tree_id) = " + vue1.$data.tree_id);

                            const data = {
                                "_put_arbol": {
                                    "arbo_id": vue1.$data.tree_id,
                                    "calle": calle,
                                    "altura": vue1.$data.number,
                                    "manz_id": vue1.$data.square_id,
                                    "nombre": $('#' + vue1.$data.idElements[0]).val(),
                                    "info_id": vue1.$data.formID.toString(),
                                    "cens_id": vue1.$data.cens_id,
                                    "lat": vue1.$data.current_lat,
                                    "long": vue1.$data.current_lng,
                                    "lat_gps": vue1.$data.audit_lat.toString(),
                                    "long_gps": vue1.$data.audit_lng.toString(),
                                    "barrio": vue1.$data.neighborhood,
                                    "tipo": "",
                                    "imagen": Picture.getBase64AndResizeImage(foto_arbol, 400, 400),
                                    "taza": vue1.$data.taza
                                }
                            };
                            console.log("_put_arbol = " + JSON.stringify(data));

                            Form.sendOnlyTreePicture(data, "PUT")
                                .then(response => {

                                    if (response.status === 200) {

                                        $(".se-pre-con").fadeOut("slow");

                                        /*** Message modal ***/
                                        let message = $("#message");

                                        /*** Prepare and show message ***/
                                        vue1.$data.alert_title = "¡Excelente!";
                                        vue1.$data.alert_message = "Los datos fueron guardados correctamente.";


                                        message.find(".modal-content").removeClass("modal-warning");
                                        message.find(".modal-content").addClass("modal-success");
                                        (<any>message).modal("show");


                                        /* Redirect to home */
                                        message.on('hidden.bs.modal', function () {

                                            window.location.replace("home.html");
                                        });

                                    } else {

                                        $(".se-pre-con").fadeOut("slow");

                                        /*** Message modal ***/
                                        let message = $("#message");

                                        /*** Prepare and show message ***/
                                        vue1.$data.alert_title = "Error en el servidor";
                                        vue1.$data.alert_message = "Se produjo un problema en el servidor y no se puedo guardar la foto del árbol.";


                                        message.find(".modal-content").removeClass("modal-success");
                                        message.find(".modal-content").addClass("modal-warning");
                                        (<any>message).modal("show");
                                    }

                                })
                                .catch(error => {

                                    if (error.response.status === 401) {

                                        ////Session.invalidate();

                                        //window.location.replace("/");
                                    }

                                    $(".se-pre-con").fadeOut("slow");

                                    /*** Message modal ***/
                                    let message = $("#message");

                                    /*** Prepare and show message ***/
                                    vue1.$data.alert_title = "Error en el servidor";
                                    vue1.$data.alert_message = "Se produjo un problema en el servidor y no se puedo guardar la foto del árbol.";


                                    message.find(".modal-content").removeClass("modal-success");
                                    message.find(".modal-content").addClass("modal-warning");
                                    (<any>message).modal("show");

                                    console.log(error);
                                });
                        })
                }

            } else {

                /* No hay conexión! */
                $(".se-pre-con").fadeOut("slow");

                // 1 Guardo el data en localstorage como array por si es mas de un árbol censado sin conex.
                /*const dynamic_form_data = {
                    "_put_formulario_batch_req": {
                        "form_id":"2",
                        "_put_formulario": json_array_put
                    }
                };
                 */

                // 3 ALmaceno los datos del árbol y la foto
                let calle = "";
                if (vue1.$data.selected_street === "Otra")
                    calle = vue1.$data.calleOtra;
                else
                    calle = vue1.$data.selected_street;

                let foto_arbol = "";
                if (!$("#treePic").prop("src").includes("/resource/image/main-icon.png"))
                    foto_arbol = $("#treePic").prop("src");
                else
                    foto_arbol = "";


                const offline_form_data = {
                    "_post_arbol_set": {
                        "calle": calle,
                        "altura": vue1.$data.number,
                        "manz_id": vue1.$data.square_id,
                        "nombre": $('#' + vue1.$data.idElements[0]).val(),
                        //"info_id": vue1.$data.formID.toString(),
                        "cens_id": vue1.$data.cens_id,
                        "lat": vue1.$data.current_lat,
                        "long": vue1.$data.current_lng,
                        "lat_gps": vue1.$data.audit_lat.toString(),
                        "long_gps": vue1.$data.audit_lng.toString(),
                        "tipo": "",
                        "imagen": Picture.getBase64AndResizeImage(foto_arbol, 400, 400),
                        "taza": vue1.$data.taza,
                        "barrio": vue1.$data.neighborhood,
                        "_put_formulario_batch_req": {
                            "form_id":"2",
                            "_put_formulario": json_array_put
                        }
                    }
                };

                if (store.get("offline_form_data") == null)
                    store.set("offline_form_data", offline_form_data);
                else {

                    store.set("offline_form_data", offline_form_data);
                }

                alert("Sus datos fueron guardados localmente al no tener servicio de internet.");

                window.location.replace("home.html");
            }



        } else {

            if (Connectivity.checkInternetSpeed() !== "offline") {

                console.log('No es taza con árbol');
                //Llamar solo servicio para enviar el domicilio y la foto del arbol.

                let calle = "";
                if (vue1.$data.selected_street === "Otra")
                    calle = vue1.$data.calleOtra;
                else
                    calle = vue1.$data.selected_street;


                let foto_arbol = "";
                if (!$("#treePic").prop("src").includes("/resource/image/main-icon.png"))
                    foto_arbol = $("#treePic").prop("src");
                else
                    foto_arbol = "";

                const data = {
                    "_post_arbol": {
                        "calle": calle,
                        "altura": vue1.$data.number,
                        "manz_id": vue1.$data.square_id,
                        "nombre": "",
                        "info_id": vue1.$data.formID.toString(),
                        "cens_id": vue1.$data.cens_id,
                        "lat": vue1.$data.current_lat,
                        "long": vue1.$data.current_lng,
                        "lat_gps": vue1.$data.audit_lat.toString(),
                        "long_gps": vue1.$data.audit_lng.toString(),
                        "barrio": vue1.$data.neighborhood,
                        "tipo": "",
                        "imagen": Picture.getBase64AndResizeImage(foto_arbol, 400, 400),
                        "taza": vue1.$data.taza
                    }
                };
                console.log(data);
                Form.sendOnlyTreePicture(data, "POST")
                    .then(response => {

                        if (response.status === 200) {

                            $(".se-pre-con").fadeOut("slow");

                            /*** Message modal ***/
                            let message = $("#message");

                            /*** Prepare and show message ***/
                            vue1.$data.alert_title = "¡Excelente!";
                            vue1.$data.alert_message = "Los datos fueron guardados correctamente.";


                            message.find(".modal-content").removeClass("modal-warning");
                            message.find(".modal-content").addClass("modal-success");
                            (<any>message).modal("show");


                            /* Redirect to home */
                            message.on('hidden.bs.modal', function () {

                                window.location.replace("home.html");
                            });

                        } else {

                            $(".se-pre-con").fadeOut("slow");

                            /*** Message modal ***/
                            let message = $("#message");

                            /*** Prepare and show message ***/
                            vue1.$data.alert_title = "Error en el servidor";
                            vue1.$data.alert_message = "Se produjo un problema en el servidor y no se puedo guardar la foto del árbol.";


                            message.find(".modal-content").removeClass("modal-success");
                            message.find(".modal-content").addClass("modal-warning");
                            (<any>message).modal("show");
                        }

                    })
                    .catch(error => {

                        if (error.response.status === 401) {

                            ////Session.invalidate();

                            //window.location.replace("/");
                        }

                        $(".se-pre-con").fadeOut("slow");

                        /*** Message modal ***/
                        let message = $("#message");

                        /*** Prepare and show message ***/
                        vue1.$data.alert_title = "Error en el servidor";
                        vue1.$data.alert_message = "Se produjo un problema en el servidor y no se puedo guardar la foto del árbol.";


                        message.find(".modal-content").removeClass("modal-success");
                        message.find(".modal-content").addClass("modal-warning");
                        (<any>message).modal("show");

                        console.log(error);
                    });
            } else {

                /* Arbol SOLO foto sin form y SIN internet */
                /* No hay conexión! */
                $(".se-pre-con").fadeOut("slow");

                // 1 Guardo el data en localstorage como array por si es mas de un árbol censado sin conex.
                /*const dynamic_form_data = {
                    "_put_formulario_batch_req": {
                        "form_id":"2",
                        "_put_formulario": json_array_put
                    }
                };
                 */

                // 3 ALmaceno los datos del árbol y la foto
                let calle = "";
                if (vue1.$data.selected_street === "Otra")
                    calle = vue1.$data.calleOtra;
                else
                    calle = vue1.$data.selected_street;

                let foto_arbol = "";
                if (!$("#treePic").prop("src").includes("/resource/image/main-icon.png"))
                    foto_arbol = $("#treePic").prop("src");
                else
                    foto_arbol = "";


                //off
                const offline_form_data = {
                    "_post_arbol_set": {
                        "calle": calle,
                        "altura": vue1.$data.number,
                        "manz_id": vue1.$data.square_id,
                        "nombre": $('#' + vue1.$data.idElements[0]).val(),
                        //"info_id": vue1.$data.formID.toString(),
                        "cens_id": vue1.$data.cens_id,
                        "lat": vue1.$data.current_lat,
                        "long": vue1.$data.current_lng,
                        "lat_gps": vue1.$data.audit_lat.toString(),
                        "long_gps": vue1.$data.audit_lng.toString(),
                        "tipo": "",
                        "imagen": Picture.getBase64AndResizeImage(foto_arbol, 400, 400),
                        "taza": vue1.$data.taza,
                        "barrio": vue1.$data.neighborhood
                    }
                };

                if (store.get("offline_form_data") == null)
                    store.set("offline_form_data", offline_form_data);
                else {

                    store.set("offline_form_data", offline_form_data);
                }

                alert("Sus datos fueron guardados localmente al no tener servicio de internet.");

                window.location.replace("home.html");

            }
        }
    } else {


        $(".se-pre-con").fadeOut("slow");

        /*** Message modal ***/
        let message = $("#message");

        /*** Prepare and show message ***/
        vue1.$data.alert_title = "Error de datos";
        vue1.$data.alert_message = "Es mandatorio tomar la foto del árbol antes de guardar.";


        message.find(".modal-content").removeClass("modal-success");
        message.find(".modal-content").addClass("modal-warning");
        (<any>message).modal("show");

    }
});
