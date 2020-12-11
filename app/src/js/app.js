/*** Vue & vee files ***/
import 'vue';

import 'vee-validate';

/*** Bootstrap files ***/
import 'bootstrap/js/dist/alert';
import 'bootstrap/js/dist/button';
import 'bootstrap/js/dist/carousel';
import 'bootstrap/js/dist/collapse';
import 'bootstrap/js/dist/dropdown';
import 'bootstrap/js/dist/modal';
import 'bootstrap/js/dist/popover';
import 'bootstrap/js/dist/scrollspy';
import 'bootstrap/js/dist/tab';
import 'bootstrap/js/dist/tooltip';
import 'bootstrap/js/dist/util';





/*** Bootswatch files ***/
import 'bootswatch/dist/flatly/bootstrap.css';


/*** Font Awesome files ***/
import '@fortawesome/fontawesome-free/css/all.css';


/*** CSS Style files ***/
import '../../resource/css/style.css';


/*** Import Image Files ***/
import '../../resource/image/loading.gif';
import '../../resource/image/main-icon.png';
import '../../resource/image/main-icon-white.png';
import '../../resource/image/default-profile-img.png';
import '../../resource/image/layers.png';
import '../../resource/image/layers-2x.png';
import '../../resource/image/marker-icon.png';
import '../../resource/image/marker-icon-2x.png';
import '../../resource/image/marker-shadow.png';
import '../../resource/image/legend/calles_2020_3.png';
import '../../resource/image/legend/capital_manzanas_0.png';
import '../../resource/image/legend/espacios_verdes_2020_1.png';
import '../../resource/image/legend/infraestructura_2.png';


import '../../resource/js/data/calles_2020_3.js';
import '../../resource/js/data/capital_manzanas_0.js';
import '../../resource/js/data/espacios_verdes_2020_1.js';
import '../../resource/js/data/infraestructura_2.js';



/*** Register Service Worker ***/
import * as OfflinePluginRuntime from 'offline-plugin/runtime';
OfflinePluginRuntime.install();

// const shouldSW = 'serviceWorker' in navigator
// if (shouldSW) {
//     navigator.serviceWorker.register('/service-worker.js').then(() => {
//         console.log("Service Worker Registered!")
//     })
// }

/*** JQuery document ready ***/
$(function () {

    console.log(" · · · · · · Trazalog  · · · · · · ");
});
