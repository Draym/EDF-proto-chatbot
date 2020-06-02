import TLogs from "../TLogs";

let HttpUtils = function () {

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

    function httpData(type, url, api, headers, data, cbSuccess, cbError) {
        if (!headers)
            headers = {};
        TLogs.p("[API_" + type + "]", url, data);
        fetch(url, {
            method: type,
            headers: headers,
            body: data
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
