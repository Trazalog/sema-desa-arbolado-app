import * as moment from 'moment';

export class DateTime {

    public static getCurrentYear(){

        return moment().year();
    }


    public static getCurrentDate(){

        return moment().locale("es").format("L");
    }
}