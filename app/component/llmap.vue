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
                manualPositionGetter(){
                  console.log("Position en getter de componente");
                  return "pepito";
                },
            getPosition() {
                console.log('Estoy dentro de la fc');
                let miPosicionLat;
                let miPosicionLng;
                let myfullpos = [];
                //*adding vars for audit position*//
                let miAuditPosicionLat;
                let miAuditPosicionLng;
                let myAuditfullpos = [];

                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(function (position) {
                            miPosicionLat = position.coords.latitude;
                            miPosicionLng= position.coords.longitude;
                            myfullpos.push(miPosicionLat);
                            myfullpos.push(miPosicionLng);

                            //*Audit position*//
                            miAuditPosicionLat=position.coords.latitude;
                            miAuditPosicionLng=position.coords.longitude;
                            myAuditfullpos.push(miAuditPosicionLat);
                            myAuditfullpos.push(miAuditPosicionLng);

                            let mymap = L.map('mapid').setView(myfullpos,20); //Max-18 here i should change the integer of second parameter. higher values means more detailed map. Check
                            L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw',
                                    {
                                            attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
                                            maxZoom: 25, //change max zoom value to allow higher values in setView method.
                                            id: 'mapbox/streets-v11',
                                            accessToken: 'your.mapbox.access.token'
                                    }).addTo(mymap);

                            let markerCurrentPos = L.marker(myfullpos, {draggable:'true', autoPan: true}).addTo(mymap);

                            markerCurrentPos.bindPopup("Su ubicación actual").openPopup();

                            markerCurrentPos.on('dragend', function(event){
                                    var marker = event.target;
                                    var manualPosition = markerCurrentPos.getLatLng();
                                    console.log("Manual position " + manualPosition);
                                    //this.myFullPos.pop;
                                    //myfullpos.push(markerCurrentPos.getLat());
                                    //myfullpos.push(markerCurrentPos.getLng());
                                    markerCurrentPos.setLatLng(manualPosition,{draggable:'true',autoPan: true}).bindPopup(position).update();
                            });


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