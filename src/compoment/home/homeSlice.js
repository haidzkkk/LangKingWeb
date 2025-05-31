import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { ref, child, get, onValue, off } from "firebase/database";
import { database } from '../../firebase';
import { Resource } from "../../data/model/resouce";

const homeSlice = createSlice({
    name: "category",
    initialState: {
        categories: Resource.initialize(),
    },
    reducers: {
        updateCategories: (state, action) => {
            state.categories = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getCategories.pending, (state) => {
                state.categories = Resource.loading();
            })
            .addCase(getCategories.fulfilled, (state, action) => {
                console.log("data: " + (action.payload));
                state.categories = Resource.success(action.payload);
            })
            .addCase(getCategories.rejected, (state, action) => {
                state.categories = Resource.error(action.payload);
            });
    },
})

export const getCategories = createAsyncThunk("data/fetchData", async (path, thunkAPI) => {
    try {
        const dbRef = ref(database);
        const snapshot = await get(child(dbRef, `LangKingData/categories`));

        if (snapshot.exists()) {
            const data = snapshot.val();
            const formatted = data ? Object.entries(data).map(([id, value]) => ({ id, ...value })) : [];
            return formatted;
        } else {
            return thunkAPI.rejectWithValue("No data available");
        }
    } catch (error) {
        return thunkAPI.rejectWithValue(error.message);
    }
});

export const listenToCategories = (dispatch) => {
    const dbRef = ref(database, "LangKingData/categories");

    const callback = (snapshot) => {
        if (snapshot.exists()) {
            const data = snapshot.val();
            const formatted = Object.entries(data).map(([id, value]) => ({ id, ...value }));
            dispatch(updateCategories(Resource.success(formatted)));
        } else {
            dispatch(updateCategories(Resource.error("No data available")));
        }
    };

    const errorCallback = (error) => {
        dispatch(updateCategories(Resource.error(error.message)));
    };

    onValue(dbRef, callback, errorCallback);

    return () => {
        off(dbRef, "value", callback);
    };
};

export const { updateCategories } = homeSlice.actions;
export default homeSlice.reducer;