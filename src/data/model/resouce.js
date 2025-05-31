const Resource = {
    initialize: (data = null, message = null) => ({
        status: 'INITIALIZE',
        data,
        message,
    }),
    loading: (data = null, message = null) => ({
        status: 'LOADING',
        data,
        message,
    }),
    success: (data, message = null) => ({
        status: 'SUCCESS',
        data,
        message,
    }),
    error: (message, data = null) => ({
        status: 'ERROR',
        data,
        message,
    }),
    isInitialize: (resource) => resource?.status === 'INITIALIZE',
    isLoading: (resource) => resource?.status === 'LOADING',
    isSuccess: (resource) => resource?.status === 'SUCCESS',
    isError: (resource) => resource?.status === 'ERROR',
};

export { Resource };
