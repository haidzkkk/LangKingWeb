import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { Resource } from "../../data/model/resouce";
import firebaseManager from "../../service/FirebaseManager";

const UserSlice = createSlice({
    name: "user",
    initialState: {
        users: Resource.initialize(),
        currentUserEdit: Resource.initialize(),
        updateStatus: Resource.initialize(),
    },
    reducers: {
        updateUsers: (state, action) => {
            state.users = action.payload;
        },
        clearFromEditUser: (state) => {
            console.log("clearFromEditUser ", state.currentUserEdit);
            state.currentUserEdit = Resource.initialize();
        },
        clearUpdateStatus: (state) => {
            console.log("clearUpdateStatus ", state.updateStatus);
            state.updateStatus = Resource.initialize();
        },
    },
    extraReducers: (builder) => {
        builder.addCase(getEditUserById.pending, (state) => {
            state.currentUserEdit = Resource.loading();
        });
        builder.addCase(getEditUserById.fulfilled, (state, action) => {
            state.currentUserEdit = action.payload;
        });
        builder.addCase(getEditUserById.rejected, (state, action) => {
            state.currentUserEdit = Resource.error(action.payload);
        });

        builder.addCase(updateUser.pending, (state) => {
            state.updateStatus = Resource.loading();
        });
        builder.addCase(updateUser.fulfilled, (state, action) => {
            state.updateStatus = action.payload;
            state.currentUserEdit = action.payload;
        });
        builder.addCase(updateUser.rejected, (state, action) => {
            state.updateStatus = Resource.error(action.payload);
        });
    },
});

export const listenToUsers = (dispatch, globalState) => {
    const callback = (data) => {
        if (data) {
            const currentUser = globalState.authState.currentUser.data;
            const formatted = Object.values(data).filter(item => item.id !== currentUser.id);
            dispatch(updateUsers(Resource.success(formatted)));
        } else {
            dispatch(updateUsers(Resource.error("No data available")));
        }
    };

    const errorCallback = (error) => {
        dispatch(updateUsers(Resource.error(error.message)));
    };

    const refPath = firebaseManager.addListener("users", callback, errorCallback);

    return () => {
        firebaseManager.removeListener(refPath);
    };
};

export const getEditUserById = createAsyncThunk(
    "user/getEditUserById",
    async (id, { rejectWithValue }) => {
        try {
            const response = await firebaseManager.getObject(`users/${id}`);
            if (Resource.isError(response)) {
                return rejectWithValue("Không tìm thấy người dùng");
            }
            return response;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const updateUser = createAsyncThunk(
    "user/updateUser",
    async (userData, { rejectWithValue }) => {
        try {
            if (!userData.id) {
                return rejectWithValue("Không tìm thấy ID người dùng");
            }
            if (!userData.username) {
                return rejectWithValue("Không tìm thấy tên đăng nhập");
            }
            if (!userData.password) {
                return rejectWithValue("Không tìm thấy mật khẩu");
            }

            const dataToUpdate = { ...userData };

            const response = await firebaseManager.overwrite(`users/${userData.id}`, dataToUpdate);
            if (Resource.isError(response)) {
                return rejectWithValue("Không thể cập nhật thông tin người dùng");
            }
            return response;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const { updateUsers, clearFromEditUser, clearUpdateStatus } = UserSlice.actions;
export default UserSlice.reducer;
