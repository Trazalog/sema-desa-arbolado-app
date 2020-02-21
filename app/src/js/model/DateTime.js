import * as moment from 'moment';
var DateTime = /** @class */ (function () {
    function DateTime() {
    }
    DateTime.getCurrentYear = function () {
        return moment().year();
    };
    DateTime.getCurrentDate = function () {
        return moment().locale("es").format("L");
    };
    return DateTime;
}());
export { DateTime };
//# sourceMappingURL=DateTime.js.map