import axios from 'axios';
import store from 'store2';
import { Connectivity } from "./Connectivity";
var Synchronization = /** @class */ (function () {
    function Synchronization() {
    }
    Synchronization.localStoreDataForm = function (form_name, data_object) {
        if (Connectivity.checkInternetSpeed() === "offline" || Connectivity.checkInternetSpeed() === "Mala") {
            /* Almacenar el formulario y los datos en un único json file */
            store.set(form_name, data_object);
        }
    };
    Synchronization.trySyncFormWithServer = function (form_name, url_backend, method) {
        var data = store.get(form_name);
        axios({
            method: method,
            url: url_backend,
            timeout: 5000,
            withCredentials: false,
            data: {
                data: data
            },
            headers: {
                'Cache-Control': 'no-cache'
            }
        });
    };
    return Synchronization;
}());
export { Synchronization };
//# sourceMappingURL=Synchronization.js.map