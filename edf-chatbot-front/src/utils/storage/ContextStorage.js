class ContextStorage {
    static GET(key) {
        let item = localStorage.getItem(key);
        if (item) {
            return JSON.parse(item);
        }
        return undefined;
    }

    static CLEAR(key) {
        localStorage.removeItem(key);
    }

    static SET(key, data) {
        if (!data) {
            return;
        }
        localStorage.setItem(key, (typeof data === 'object' ? JSON.stringify(data) : data));
    }
}

export default ContextStorage;

