import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { ref, child, get } from "firebase/database";
import { database } from '../../firebase';
import { Resource } from "../../data/model/resouce";

const processLessonData = (lessonData) => {
    if (!lessonData.words) {
        lessonData.words = [];
    }
    const sortedEntries = Object.entries(lessonData.words)
        .sort(([, a], [, b]) => (a.position || 0) - (b.position || 0));

    lessonData.words = Object.fromEntries(
        sortedEntries.map(([key, word]) => [key, word])
    );

    return lessonData;
};

const lessonSlice = createSlice({
    name: "lesson",
    initialState: {
        lesson: Resource.initialize(),
        categoryId: null,
    },
    reducers: {
        resetLesson: (state) => {
            state.lesson = Resource.initialize();
            state.categoryId = null;
        },
        setCategoryId: (state, action) => {
            state.categoryId = action.payload;
        },
        updateLesson: (state, action) => {
            state.lesson = Resource.success(action.payload);
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getLeson.pending, (state) => {
                state.lesson = Resource.loading();
            })
            .addCase(getLeson.fulfilled, (state, action) => {
                if (action.payload.data) {
                    const processedData = processLessonData(action.payload.data);
                    state.lesson = Resource.success(processedData);
                } else {
                    state.lesson = Resource.initialize();
                }
                state.categoryId = action.payload.categoryId;
            })
            .addCase(getLeson.rejected, (state, action) => {
                state.lesson = Resource.error(action.payload);
            });
    },
});

export const getLeson = createAsyncThunk("data/fetchLeson", async ({ categoryId, lessonId }, thunkAPI) => {

    await new Promise(resolve => setTimeout(resolve, 2000));

    if (!categoryId && !lessonId) {
        return thunkAPI.rejectWithValue("No data available");
    } else if (categoryId && !lessonId) {
        return {
            categoryId: categoryId,
        };
    }

    try {
        console.log(`LangKingData/categories/${categoryId}/lessons/${lessonId}`);
        const dbRef = ref(database);
        const snapshot = await get(child(dbRef, `LangKingData/categories/${categoryId}/lessons/${lessonId}`));

        if (snapshot.exists()) {
            const data = snapshot.val();

            return {
                data: data,
                categoryId: data.categoryId,
            };
        } else {
            return thunkAPI.rejectWithValue("No data available");
        }
    } catch (error) {
        return thunkAPI.rejectWithValue(error.message);
    }
});

export const { resetLesson, setCategoryId, updateLesson } = lessonSlice.actions;
export default lessonSlice.reducer;