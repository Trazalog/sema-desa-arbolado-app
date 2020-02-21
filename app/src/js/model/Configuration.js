var detect = require('detect-browser').detect;
var browser = detect();
var Configuration = /** @class */ (function () {
    function Configuration() {
    }
    Configuration.getBrowserName = function () {
        if (browser)
            return browser.name;
    };
    Configuration.getBrowserVersion = function () {
        if (browser)
            return browser.version;
    };
    Configuration.getBrowserOS = function () {
        if (browser)
            return browser.os;
    };
    Configuration.checkCompatibility = function () {
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
    };
    return Configuration;
}());
export { Configuration };
//# sourceMappingURL=Configuration.js.map