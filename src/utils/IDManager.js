const IDManager = {
    createID: () => {
        return crypto.randomUUID();
    }
};

export default IDManager;