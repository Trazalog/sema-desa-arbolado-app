import  from ;
import { DateTime } from "../src/js/model/DateTime";
import { Session } from "../src/js/model/Session";
export default new ({
    name: "main-header",
    //props: ['username', 'current_date'],
    data: function () {
        return {
            username: '',
            current_date: ''
        };
    },
    methods: {
        setUsername: function () {
            this.username = Session.getSessionUsername();
        },
        getCurrentDate: function () {
            this.current_date = DateTime.getCurrentDate();
        },
        logout: function () {
            Session.invalidate();
            window.location.replace("/");
        }
    },
    mounted: function () {
        this.setUsername();
        this.getCurrentDate();
    }
});
//# sourceMappingURL=main-header.vue.js.map