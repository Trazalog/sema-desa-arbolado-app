<template>
        <div id="myTreesMap" style="height: 400px;"></div>
</template>

<script>
    import * as Vue2Leaflet from 'vue2-leaflet';
    import store from 'store2';
    export default {
        name: "mis-arboles-censados-map",
        components: { Vue2Leaflet },
        data() {
            return {
                myFullPos:[-31.534915, -68.534509],
            }
        },
        mounted() {
                this.showllMapTreeList();
        },
        methods: {
                getCurrentPosition() {
                        /*get my current position and add a marker to the map*/

                },

            showllMapTreeList (position){
                console.log('DEL PADRE' + this.$parent.myVar);
                console.log('DEL PADRE pos' + JSON.stringify( this.$parent.my_position));
                console.log("VAR DEL DATA" + this.myFullPos);
                let myCurrentPos = this.$parent.my_position;
                let myCurrentPosition =  this.myFullPos;
                let fullTreeListFromStorage = store.get('get_tree_response');
                let mymap = L.map('myTreesMap').setView(myCurrentPosition,13);
                L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw',
                    {
                        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
                        maxZoom: 18,
                        id: 'mapbox/streets-v11',
                        accessToken: 'your.mapbox.access.token'
                    }).addTo(mymap);
                let markerCurrentPos = L.marker(myCurrentPosition).addTo(mymap);
                let currentPosMarker_content = "Su ubicación actual es" + "<br/>" + "Esta, señor";
                markerCurrentPos.bindPopup(currentPosMarker_content).openPopup();

                }
            }

    }

</script>

<style scoped>

</style>