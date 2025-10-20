module.exports = (app) => {
    var moment = require('moment');
    //moment.locale('pt-br');
    //.utcOffset("-03:00")

    this.locale = function() {
        return moment.utc().toDate();
    }

    this.nowDB = function() {
        return moment().utcOffset("-03:00").format("YYYY-MM-DD HH:mm:ss");
    }

    this.nowDBTime = function() {
        return moment().utcOffset("-03:00").format("HH:mm:ss");
    }

    this.nowDBNoTime = function() {
        return moment().format("YYYY-MM-DD");
    }

    this.now = function() {
        return moment().utcOffset("-03:00").format("DD-MM-YYYY ");
    }

    this.nowNoTime = function() {
        return moment().utcOffset("-03:00").format("DD/MM/YYYY");
    }

    this.nowTime = function() {
        return moment().utcOffset("-03:00").format("HH:mm:ss");
    }

    this.formatWithTime = function(data) {
        return moment(data).utcOffset("-03:00").format("DD/MM/YYYY HH:mm:ss")
    }

    this.format = function(data) {
        return moment(data).format("DD/MM/YYYY")
    }

    this.formatToDB = function(data) {
        let array = data.split("/");
        return array[2] + "-" + array[1] + "-" + array[0];
    }
    this.formatWithTimeToDB = function(data) {
        let array = data.split("/");
        let aux = array[2] + "-" + array[1] + "-" + array[0];
        return moment(aux).format("YYYY-MM-DD HH:mm:ss");
    }

    this.compare = function(x, y) {
        let a = moment(x);
        let b = moment(y)

        return a.diff(b, 'days');
    }

    this.formatExpirationDate = function(data) {
        let dateNow = moment(new Date());
        let expirationDate = moment(data).add(1, 'Y');
        let daysLeft = expirationDate.diff(dateNow, 'days');

        return daysLeft;
    }

    this.formatExpirationDateReserva = function(data) {
        let dateNow = moment(new Date());
        let expirationDate = moment(data).add(29, 'day');
        let daysLeft = expirationDate.diff(dateNow, 'days');

        return daysLeft;
    }

    this.formatDateToExcel = function(data) {
        data = data.split(' ');
        let date = data[0].split(/\//);
        let time = data[1];

        let newData = date[1] + '/' + date[0] + '/' + date[2] + ' ' + time;
        let returnDate = new Date(newData);
        if (returnDate != 'Invalid Date') {
            return new Date(newData);
        }
        return "";
    }

    this.addDaysToDate = function(data, days) {
        return moment(data).add(days, 'day');
    }


    return this;

}