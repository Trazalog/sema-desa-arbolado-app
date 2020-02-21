var Connectivity = /** @class */ (function () {
    function Connectivity() {
    }
    Connectivity.checkInternetSpeed = function () {
        if (!navigator.onLine) {
            return "offline";
        }
        else if (navigator.connection.downlink < 0.5 && navigator.connection.downlink > 0) {
            return "Mala";
        }
        else if (navigator.connection.downlink >= 0.5 && navigator.connection.downlink < 1) {
            return "Regular";
        }
        else if (navigator.connection.downlink >= 1) {
            return "Buena";
        }
    };
    return Connectivity;
}());
export { Connectivity };
//# sourceMappingURL=Connectivity.js.map