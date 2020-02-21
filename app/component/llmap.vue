<template>
        <div id="mapid" style="height: 400px;"></div>
</template>

<script>
        export default {
        name: "llmap",
        data() {
            return {
                 miPosicionActual:[0,0],
            }
        },
        mounted() {
            this.getPosition();
        },
        methods: {
            getPosition() {
                console.log('Estoy dentro de la fc');
                let miPosicionLat;
                let miPosicionLng;
                let myfullpos = [];
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(function (position) {
                            miPosicionLat = position.coords.latitude;
                            miPosicionLng= position.coords.longitude;
                            myfullpos.push(miPosicionLat);
                            myfullpos.push(miPosicionLng);
                            let mymap = L.map('mapid').setView(myfullpos,13);
                            L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw',
                                    {
                                            attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
                                            maxZoom: 18,
                                            id: 'mapbox/streets-v11',
                                            accessToken: 'your.mapbox.access.token'
                                    }).addTo(mymap);
                            let markerCurrentPos = L.marker(myfullpos).addTo(mymap);
                            markerCurrentPos.bindPopup("Su ubicación actual").openPopup();
                    });

                }else{
                        console.log('No se ha podido geoposicionar');

                }
            },
        }
    }
</script>

<style scoped>

</style>