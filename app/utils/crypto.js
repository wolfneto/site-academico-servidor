const CryptoJS = require("crypto-js");
const Bcrypt = require('bcrypt');
const Salt = 10;

module.exports = (app) => {

    const key = 'bb05c9c4ab93db48f00fcaba4a7968d89973592854d7ad795823d87be95d7071';

    this.decrypt = function(value, obj) {
        let bytes = CryptoJS.AES.decrypt(value, key);
        if (obj) {
            return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

        }
        return bytes.toString(CryptoJS.enc.Utf8);
    }

    this.encrypt = function(value, obj) {
        if (obj) {
            value = JSON.stringify(value);
        }
        return CryptoJS.AES.encrypt(value, key).toString();
    }

    this.Bcrypt = Bcrypt;
    this.Salt = Salt;

    return this;
}