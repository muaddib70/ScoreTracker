namespace Services {
    export class StorageService {

        constructor() { }

        saveValueToLocal = function (key: string, value: any): void {
            localStorage.setItem(key, JSON.stringify(value));
        }

        getValueFromLocal = function (key: string): any {
            let jsonValue = localStorage.getItem(key);
            if (jsonValue) {

                return JSON.parse(jsonValue);
            }
            else {
                return null;
            }
        }

        removeFromLocal = function (key: string): void {
            localStorage.removeItem(key);
        }

    }
}