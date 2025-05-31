import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { Resource } from "../../data/model/resouce";
import firebaseManager from "../../service/FirebaseManager";

const homeSlice = createSlice({
    name: "category",
    initialState: {
        categories: Resource.initialize(),
        currentAddCategory: Resource.initialize(),
        confirmData: Resource.initialize(),
    },
    reducers: {
        updateCategories: (state, action) => {
            state.categories = action.payload;
        },
        resetConfirmData: (state) => {
            state.confirmData = Resource.initialize();
        },
        setNewCategory: (state, action) => {
            state.currentAddCategory = Resource.success(action.payload)
        },
        resetAddCategory: (state) => {
            state.currentAddCategory = Resource.initialize();
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(deleteLesson.pending, (state) => {
                state.confirmData = Resource.loading();
            })
            .addCase(deleteLesson.fulfilled, (state, action) => {
                const lesson = action.payload;
                state.confirmData = Resource.success(lesson, `Xóa bài học ${lesson.name} thành công`);
            })
            .addCase(deleteLesson.rejected, (state, action) => {
                state.confirmData = Resource.error(action.payload);
            })

            .addCase(deleteCategory.pending, (state) => {
                state.confirmData = Resource.loading();
            })
            .addCase(deleteCategory.fulfilled, (state, action) => {
                const category = action.payload;
                state.confirmData = Resource.success(category, `Xóa ${category.name} thành công`);
            })
            .addCase(deleteCategory.rejected, (state, action) => {
                state.confirmData = Resource.error(action.payload);
            })

            .addCase(updateCategory.pending, (state) => {
                state.confirmData = Resource.loading();
            })
            .addCase(updateCategory.fulfilled, (state, action) => {
                const category = action.payload;
                state.confirmData = Resource.success(category, `Sửa ${category.name} thành công`);
            })
            .addCase(updateCategory.rejected, (state, action) => {
                state.confirmData = Resource.error(action.payload);
            })

            .addCase(addNewCategory.pending, (state) => {
                state.confirmData = Resource.loading();
            })
            .addCase(addNewCategory.fulfilled, (state, action) => {
                const category = action.payload;
                state.confirmData = Resource.success(category, `Thêm ${category.name} thành công`);
                state.currentAddCategory = Resource.initialize();
            })
            .addCase(addNewCategory.rejected, (state, action) => {
                state.confirmData = Resource.error(action.payload);
            })
    }
})

export const listenToCategories = (dispatch) => {
    const callback = (data) => {
        if (data) {
            const formatted = Object.entries(data).map(([id, value]) => ({ id, ...value }));
            dispatch(updateCategories(Resource.success(formatted)));
        } else {
            dispatch(updateCategories(Resource.error("No data available")));
        }
    };

    const errorCallback = (error) => {
        dispatch(updateCategories(Resource.error(error.message)));
    };

    const refPath = firebaseManager.addListener("categories", callback, errorCallback);

    return () => {
        firebaseManager.removeListener(refPath);
    };
};


export const deleteLesson = createAsyncThunk(
    "lesson/deleteLesson",
    async ({ categoryId, lesson }, { rejectWithValue }) => {
        try {
            const response = await firebaseManager.remove(`categories/${categoryId}/lessons/${lesson.id}`);

            if (Resource.isError(response)) {
                return rejectWithValue(response.message);
            }
            return lesson;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const deleteCategory = createAsyncThunk(
    "category/deleteCategory",
    async (category, { rejectWithValue }) => {
        try {
            const response = await firebaseManager.remove(`categories/${category.id}`);

            if (Resource.isError(response)) {
                return rejectWithValue(response.message);
            }
            return category;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const updateCategory = createAsyncThunk(
    "category/updateCategory",
    async (category, { rejectWithValue }) => {
        try {
            const response = await firebaseManager.overwrite(`categories/${category.id}`, category);

            if (Resource.isError(response)) {
                return rejectWithValue(response.message);
            }
            return category;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const addNewCategory = createAsyncThunk(
    "category/addNewCategory",
    async ({ name }, { getState, rejectWithValue }) => {
        try {
            const globalState = getState();
            const maxPosition = globalState.homeState.categories.data
                ? Math.max(...globalState.homeState.categories.data.map(cat => cat.position || 0))
                : 0;

            const category = {
                id: Date.now().toString(),
                name: name,
                position: maxPosition + 1,
            }

            const response = await firebaseManager.push(`categories/${category.id}`, category);

            if (Resource.isError(response)) {
                return rejectWithValue(response.message);
            }
            return category;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const { updateCategories, resetConfirmData, setNewCategory, resetAddCategory } = homeSlice.actions;
export default homeSlice.reducer;