import ExecutionEnvironment from "fbjs/lib/ExecutionEnvironment";
import config from "../config";

var expires, date, nameEQ, ca, c;

export function createCookie(name, value, days, req) {
    if (days) {
        date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = '; expires=' + date.toGMTString();
    }
    else expires = '';
    if (req == undefined) document.cookie = name + '=' + value + expires + '; path=/';
    else req.cookie(name, value, {expires});
}

export function readCookie(name, req) {
    if (req == undefined) {
        nameEQ = name + '=';
        ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            c = ca[i];
            while (c.charAt(0) == ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
        }
    }
    else return req.cookies[name]

}

export function eraseCookie(name) {
    if (ExecutionEnvironment.canUseDOM) {
        createCookie(name, '', -1);
    }

}

//******************************


export function formArrayToJson(formArray) {
    let obj = {};
    formArray.forEach(function (elem) {
        if (elem.name.indexOf('__') > 0) {
            let nameAndKey = elem.name.split('__');
            let name = nameAndKey[0];
            let key = nameAndKey[1];
            if (!obj[name]) obj[name] = [];
            obj[name].push(key);
        }
        else {
            obj[elem.name] = elem.value;
        }

    });
    return obj;

}

export function mapNodes(nodes, func) {
    if (nodes != null && nodes.ids != null) {
        let ids = nodes.ids;
        if (!(ids instanceof Array)) ids = [ids]
        let entities = nodes.entities;
        return ids.map(function (id, index) {
            return func(entities[id], index);
        })
    }
    else {
        return null
    }
}


export function serializeParams(obj) {
    var str = [];
    for (var p in obj)
        if (obj.hasOwnProperty(p) && obj[p] !== undefined) {
            str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]));
        }
    return str.join('&');
}


export const apiHost = 'http://' + config.api.host + ':' + config.api.port + '/api/v' + config.api.version;
