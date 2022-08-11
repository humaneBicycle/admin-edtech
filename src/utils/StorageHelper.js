let storage=window.localStorage;
export default class StorageHelper{
    static set(key, value){
        storage.setItem(key, value);
    }
    static get(key){
        return storage.getItem(key);
    }
    static remove(key){
        storage.removeItem(key);
    }
    static clear(){
        storage.clear();
    }
}