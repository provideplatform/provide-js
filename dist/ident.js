import { ApiClient } from './apiClient';
var Ident = (function () {
    function Ident(token, scheme, host, path) {
        if (!host)
            host = Ident.DEFAULT_HOST;
        this.client = new ApiClient(token, scheme, host, path);
    }
    Ident.prototype.createApplication = function (params) {
        return this.client.post('applications', params);
    };
    Ident.prototype.updateApplication = function (app_id, params) {
        return this.client.put("applications/" + app_id, params);
    };
    Ident.prototype.fetchApplications = function (params) {
        return this.client.get('applications', params);
    };
    Ident.prototype.fetchApplicationDetails = function (app_id) {
        return this.client.get("applications/" + app_id, {});
    };
    Ident.prototype.fetchApplicationTokens = function (app_id) {
        return this.client.get("applications/" + app_id + "/tokens", {});
    };
    Ident.prototype.authenticate = function (params) {
        return this.client.post('authenticate', params);
    };
    Ident.prototype.fetchTokens = function (params) {
        return this.client.get('tokens', params);
    };
    Ident.prototype.fetchTokenDetails = function (token_id) {
        return this.client.get("tokens/" + token_id, {});
    };
    Ident.prototype.deleteToken = function (token_id) {
        return this.client.delete("tokens/" + token_id);
    };
    Ident.prototype.createUser = function (params) {
        return this.client.post('users', params);
    };
    Ident.prototype.fetchUsers = function () {
        return this.client.get('users', {});
    };
    Ident.prototype.fetchUserDetails = function (user_id) {
        return this.client.get("users/" + user_id, {});
    };
    Ident.prototype.updateUser = function (user_id, params) {
        return this.client.put("users/" + user_id, params);
    };
    Ident.DEFAULT_HOST = 'ident.provide.services';
    return Ident;
}());
export { Ident };
//# sourceMappingURL=ident.js.map