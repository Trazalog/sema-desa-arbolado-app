const { detect } = require('detect-browser');
const browser = detect();

export class Configuration {


    public static getBrowserName(){

        if (browser)
            return browser.name;
    }


    public static getBrowserVersion(){

        if (browser)
            return browser.version;
    }


    public static getBrowserOS(){

        if (browser)
            return browser.os;
    }


    public static checkCompatibility(){

        switch (browser && this.getBrowserName()) {
            case 'chrome': {

                return parseInt(this.getBrowserVersion()) >= 75;

            }
            case 'firefox': {

                return parseInt(this.getBrowserVersion()) >= 67;

            }

            case 'edge': {

                return parseInt(this.getBrowserVersion()) >= 76;

            }

            case 'opera': {

                return parseInt(this.getBrowserVersion()) >= 46;

            }

            default:
                return false;
        }
    }
}