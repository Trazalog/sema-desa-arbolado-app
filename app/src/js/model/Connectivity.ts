export class Connectivity {

    public static checkInternetSpeed() {

        if (!navigator.onLine){

            return "offline";

        }
        else if ((navigator as any).connection.downlink < 0.5 && (navigator as any).connection.downlink > 0){

            return "Mala";

        }
        else if ((navigator as any).connection.downlink >= 0.5 && (navigator as any).connection.downlink < 1) {

            return "Regular";

        }

        else if ((navigator as any).connection.downlink >= 1) {

            return "Buena";

        }
    }
}
