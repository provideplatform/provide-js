var ApiClient = (function () {
    function ApiClient(token, scheme, host, path) {
        this.requestAPI = require('request-promise-native');
        if (!scheme)
            scheme = ApiClient.DEFAULT_SCHEME;
        if (!host)
            host = ApiClient.DEFAULT_HOST;
        if (!path)
            path = ApiClient.DEFAULT_PATH;
        this.baseUrl = scheme + "://" + host + "/" + path + "/";
        this.headers = {
            'user-agent': 'provide-js client',
            'authorization': "bearer " + token,
        };
    }
    ApiClient.prototype.get = function (uri, params) {
        var options = {
            headers: this.headers,
            qs: params,
            json: true,
        };
        return this.requestAPI.get(uri, options);
    };
    ApiClient.prototype.post = function (uri, params) {
        var options = {
            headers: this.headers,
            body: params,
            json: true,
        };
        return this.requestAPI.post(uri, options);
    };
    ApiClient.prototype.put = function (uri, params) {
        var options = {
            headers: this.headers,
            body: params,
            json: true,
        };
        return this.requestAPI.put(uri, options);
    };
    ApiClient.prototype.delete = function (uri) {
        var options = {
            headers: this.headers,
            json: true,
        };
        return this.requestAPI.delete(uri, options);
    };
    ApiClient.DEFAULT_SCHEME = 'https';
    ApiClient.DEFAULT_HOST = 'provide.services';
    ApiClient.DEFAULT_PATH = 'api';
    return ApiClient;
}());
export { ApiClient };
//# sourceMappingURL=apiClient.js.map