import axios from 'axios';
import store from 'store2';
import {Connectivity} from "./Connectivity";


export class Synchronization {


    public static localStoreDataForm(form_name: string, data_object: any) {

        if (Connectivity.checkInternetSpeed() === "offline" || Connectivity.checkInternetSpeed() === "Mala") {

            /* Almacenar el formulario y los datos en un único json file */
            store.set(form_name, data_object);
        }
    }


    public static trySyncFormWithServer(form_name: string, url_backend: string, method: string){

        let data = store.get(form_name);

        axios({
            method: method,
            url: url_backend,
            timeout: 5000,
            withCredentials: false,
            data: {
                data
            },
            headers: {
                'Cache-Control': 'no-cache'
            }
        });
    }
}