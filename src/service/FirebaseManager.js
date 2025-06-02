import { ref, child, get, set, remove, onValue, off } from "firebase/database";
import { Resource } from "../data/model/resouce";
import { database } from '../firebase';

const rootRef = ref(database, "LangKingData"); // thay bằng tên root của bạn

const firebaseManager = {
    async getObject(path) {
        try {
            const snapshot = await get(child(rootRef, path));
            const data = snapshot.val();
            if (data) {
                return Resource.success(data);
            } else {
                return Resource.error("No data available");
            }
        } catch (error) {
            return Resource.error(error.message);
        }
    },

    async getList(path) {
        try {
            const snapshot = await get(child(rootRef, path));
            const data = snapshot.val();
            const list = data
                ? Object.entries(data).map(([id, value]) => ({ id, ...value }))
                : [];
            return Resource.success(list);
        } catch (error) {
            return Resource.error(error.message);
        }
    },

    readOnce(path, onSuccess, onError) {
        get(child(rootRef, path))
            .then((snapshot) => {
                onSuccess(snapshot.val());
            })
            .catch((error) => {
                onError(error);
            });
    },

    addListener(path, callback, errorCallback = null) {
        const refPath = child(rootRef, path);
        onValue(refPath, (snapshot) => {
            callback(snapshot.val());
        }, errorCallback);
        return refPath;
    },

    removeListener(refPath) {
        off(refPath);
    },

    async overwrite(path, data) {
        try {
            await set(child(rootRef, path), data);
            return Resource.success(data);
        } catch (error) {
            return Resource.error(error.message);
        }
    },

    async push(path, data) {
        try {
            const finalData = Array.isArray(data)
                ? Object.fromEntries(data.map((item) => [item.id, item]))
                : data;
            await set(child(rootRef, path), finalData);
            return Resource.success(data);
        } catch (error) {
            return Resource.error(error.message);
        }
    },

    async remove(path) {
        try {
            await remove(child(rootRef, path));
            return Resource.success(null);
        } catch (error) {
            return Resource.error(error.message);
        }
    },

    getReference(path) {
        return child(rootRef, path);
    }
};

export default firebaseManager;
