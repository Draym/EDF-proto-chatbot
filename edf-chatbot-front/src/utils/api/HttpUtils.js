import TLogs from "../TLogs";
import TString from "../TString";

let HttpUtils = function () {

    function stringifyParameters(parameters) {
        let result = '';

        for (let key in parameters) {
            if (TString.isNull(parameters[key])) {
                continue;
            }
            if (result !== '')
                result += '&';
            result += key + '=' + parameters[key];
        }
        result = (result === '' ? result : '?' + result);
        return result;
    }

    function createApiUrl(domainUrl, urlParameters) {
        return (domainUrl ? domainUrl : '') + (urlParameters ? urlParameters : '');
    }

    function triggerResultCallback(data, response, cbSuccess, cbError) {
        const status = response.status;

        TLogs.p("[HTTP]", response);
        if (status === 200) {
            TLogs.p("[SUCCESS]-->", data);
            cbSuccess(data);
        } else {
            TLogs.p("[ERROR]-->", data);
            if (cbError) {
                cbError(status, (data.message ? data.message : data));
            }
        }
    }

    function handleHttpResult(response, cbSuccess, cbError) {
        response.text().then(function (text) {
            let data = text;
            try {
                data = JSON.parse(text)
            } catch (err) {
                TLogs.p("HttpResult: JSON err ->", err);
            }
            triggerResultCallback(data, response, cbSuccess, cbError);
        });
    }

    function httpData(type, url, headers, data, cbSuccess, cbError) {
        if (!headers)
            headers = {};
        TLogs.p("[API_" + type + "]", url, data);
        let urlParameters = stringifyParameters(data);
        fetch(createApiUrl(url, urlParameters), {
            method: type,
            headers: headers
        }).then(response => {
            handleHttpResult(response, cbSuccess, cbError);
        }).catch(error => {
            TLogs.p("[FAIL]-->", error);
            if (cbError) {
                cbError(-1, error.message);
            }
        });
    }

    return ({
        POST: function (url, data, cbSuccess, cbError) {
            let headers = {};
            headers['Content-Type'] = 'application/x-www-form-urlencoded';
            httpData('POST', url, headers, data, cbSuccess, cbError);
        }
    });
}();

export default HttpUtils;
