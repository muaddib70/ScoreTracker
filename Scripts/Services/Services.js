var Services;
(function (Services) {
    class StorageService {
        constructor() {
            this.saveValueToLocal = function (key, value) {
                localStorage.setItem(key, JSON.stringify(value));
            };
            this.getValueFromLocal = function (key) {
                let jsonValue = localStorage.getItem(key);
                if (jsonValue) {
                    return JSON.parse(jsonValue);
                }
                else {
                    return null;
                }
            };
            this.removeFromLocal = function (key) {
                localStorage.removeItem(key);
            };
        }
    }
    Services.StorageService = StorageService;
})(Services || (Services = {}));
//# sourceMappingURL=Services.js.map