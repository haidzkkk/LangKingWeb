import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Resource } from "../../data/model/resouce";
import { USER_ROLE_ADMIN, LOCAL_STORAGE_USER_KEY } from "../../utils/AppConstans";
import firebaseManager from "../../service/FirebaseManager";

const authSlice = createSlice({
    name: "auth",
    initialState: {
        currentUser: Resource.initialize(),
        loginConfirm: Resource.initialize(),
        loginFormData: {
            username: '',
            password: '',
        },
    },
    reducers: {
        setCurrentUser: (state, action) => {
            state.currentUser = action.payload;
        },
        setLoginFormData: (state, action) => {
            state.loginFormData = action.payload;
        },
        clearLoginFormData: (state) => {
            state.loginConfirm = Resource.initialize();
            state.loginFormData = {
                username: '',
                password: '',
            };
        },
        logout: (state) => {
            state.currentUser = Resource.initialize();
            state.loginConfirm = Resource.initialize();
            state.loginFormData = {
                username: '',
                password: '',
            };
            localStorage.setItem(LOCAL_STORAGE_USER_KEY, null);
        },
    },
    extraReducers: (builder) => {
        builder.addCase(authUserById.pending, (state) => {
            state.currentUser = Resource.loading();
        });
        builder.addCase(authUserById.fulfilled, (state, action) => {
            state.currentUser = action.payload;
        });
        builder.addCase(authUserById.rejected, (state, action) => {
            state.currentUser = Resource.error(action.payload);
        });

        builder.addCase(authUserByUsername.pending, (state) => {
            state.loginConfirm = Resource.loading();
        });
        builder.addCase(authUserByUsername.fulfilled, (state, action) => {
            state.loginConfirm = action.payload;
        });
        builder.addCase(authUserByUsername.rejected, (state, action) => {
            state.loginConfirm = Resource.error(action.payload);
        });
    },
});

export const authUserById = createAsyncThunk(
    "auth/authUserById",
    async (userId, { rejectWithValue }) => {
        if (!userId) {
            return rejectWithValue("");
        }
        const user = await firebaseManager.getObject(`users/${userId}`);

        if (!Resource.isSuccess(user)) {
            localStorage.setItem(LOCAL_STORAGE_USER_KEY, null);
            return rejectWithValue("Không tìm thấy tài khoản");
        }
        if (user.data.role !== USER_ROLE_ADMIN) {
            localStorage.setItem(LOCAL_STORAGE_USER_KEY, null);
            return rejectWithValue("Bạn không có quyền truy cập vào trang này");
        }
        return user;
    }
);

export const authUserByUsername = createAsyncThunk(
    "auth/authUserByUsername",
    async ({ username, password }, { rejectWithValue }) => {
        if (!username || !password) {
            return rejectWithValue("Bạn chưa nhập tên tài khoản hoặc mật khẩu");
        }
        const user = await firebaseManager.getObject(`users/${username}`);
        if (!Resource.isSuccess(user)) {
            return rejectWithValue("Không tìm thấy tài khoản");
        }
        if (user.data.password !== password) {
            return rejectWithValue("Mật khẩu không chính xác");
        }
        if (user.data.role !== USER_ROLE_ADMIN) {
            return rejectWithValue("Bạn không có quyền truy cập vào trang này");
        }

        localStorage.setItem(LOCAL_STORAGE_USER_KEY, user.data.id);
        return user;
    }
);

export const { setCurrentUser, setLoginFormData, clearLoginFormData, logout } = authSlice.actions;
export default authSlice.reducer;
