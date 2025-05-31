import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { Resource } from "../../data/model/resouce";
import firebaseManager from "../../service/FirebaseManager";

const processLessonData = (lessonResource) => {
    if (Resource.isError(lessonResource) || !lessonResource.data) {
        return lessonResource
    }
    if (!lessonResource.data.words) {
        lessonResource.data.words = [];
    }
    const sortedEntries = Object.entries(lessonResource.data.words)
        .sort(([, a], [, b]) => (a.position || 0) - (b.position || 0));

    lessonResource.data.words = Object.fromEntries(
        sortedEntries.map(([key, word]) => [key, word])
    );

    return lessonResource;
};

const lessonSlice = createSlice({
    name: "lesson",
    initialState: {
        currentLesson: Resource.initialize(),
        currentCategory: Resource.initialize(),
        saveLesson: Resource.initialize(),
    },
    reducers: {
        resetLesson: (state) => {
            state.currentLesson = Resource.initialize();
            state.currentCategory = Resource.initialize();
        },
        updateLesson: (state, action) => {
            state.currentLesson = Resource.success(action.payload);
        },
        updateName: (state, action) => {
            state.currentLesson.data.name = action.payload;
        },
        updateContent: (state, action) => {
            state.currentLesson.data.content = action.payload;
        },
        addNewWord: (state) => {
            if (!state.currentLesson.data?.words) {
                state.currentLesson.data.words = {};
            }
            const newWord = {
                id: Date.now(),
                word: '',
                position: Object.keys(state.currentLesson.data.words).length + 1
            };
            state.currentLesson.data.words[newWord.id] = newWord;
        },
        updateWord: (state, action) => {
            const wordUpdate = action.payload
            state.currentLesson.data.words[wordUpdate.id] = wordUpdate;
        },
        deleteWord: (state, action) => {
            const { wordId } = action.payload;
            delete state.currentLesson.data.words[wordId];
        },
        resetSaveLesson: (state) => {
            state.saveLesson = Resource.initialize();
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(initLesson.pending, (state) => {
                state.currentLesson = Resource.loading();
            })
            .addCase(initLesson.fulfilled, (state, action) => {
                const { categoryResource, lessonResource } = action.payload;

                if (categoryResource && !lessonResource){
                    const newLesson = {
                        id: Date.now(),
                        name: '',
                        content: '',
                        categoryId: categoryResource.data.id,
                    };
                    state.currentLesson = Resource.success(newLesson);
                } else {
                    const processedData = processLessonData(lessonResource);
                    state.currentLesson = processedData;
                }

                state.currentCategory = categoryResource;
            })
            .addCase(initLesson.rejected, (state, action) => {
                state.currentLesson = Resource.error(action.payload);
            })
            .addCase(postSaveLesson.pending, (state) => {
                state.saveLesson = Resource.loading();
            })
            .addCase(postSaveLesson.fulfilled, (state, action) => {
                state.saveLesson = Resource.success(action.payload, "Lưu bài học thành công");
                state.currentLesson = Resource.success(action.payload);
            })
            .addCase(postSaveLesson.rejected, (state, action) => {
                state.saveLesson = Resource.error(action.payload);
            });
    },
});

export const initLesson = createAsyncThunk(
    "data/fetchLeson",
    async ({ categoryId, lessonId }, thunkAPI) => {

        await new Promise(resolve => setTimeout(resolve, 2000));

        if (!categoryId && !lessonId) {
            return thunkAPI.rejectWithValue("No data available");
        }

        const category = await firebaseManager.getObject(`categories/${categoryId}`);
        if (categoryId && !lessonId) {
            return {
                categoryResource: category,
            };
        }

        try {
            const lesson = await firebaseManager.getObject(`categories/${categoryId}/lessons/${lessonId}`);
            return {
                lessonResource: lesson,
                categoryResource: category,
            }
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    });


export const postSaveLesson = createAsyncThunk(
    "lesson/saveLesson",
    async (lessonSave, { getState, rejectWithValue }) => {
        // Validation
        if (!lessonSave.id || !lessonSave.categoryId) {
            return rejectWithValue("Không tìm thấy bài học");
        } else if (!lessonSave.name) {
            return rejectWithValue("Hãy đặt tên cho bài học");
        } else if (!lessonSave.content) {
            return rejectWithValue("Hãy nhập nội dung bài học");
        } else if (!lessonSave.words || Object.keys(lessonSave.words).length === 0) {
            return rejectWithValue("Hãy thêm từ vào bài học");
        } else if (Object.values(lessonSave.words).find(word => !word.english)) {
            return rejectWithValue("Có từ không có nghĩa tiếng Anh");
        }


        try {
            const lessonToSave = { ...lessonSave };
            let isNewLesson = false;

            if (!lessonToSave.position) {
                isNewLesson = true;
                const words = getState().lessonState.currentLesson.data.words
                const maxPosition = words
                    ? Math.max(...Object.values(words).map(word => word.position || 0))
                    : 0;
                lessonToSave.position = maxPosition + 1;
            }

            const data = isNewLesson ?
                await firebaseManager.push(`categories/${lessonSave.categoryId}/lessons/${lessonToSave.id}`, lessonToSave) :
                await firebaseManager.overwrite(`categories/${lessonSave.categoryId}/lessons/${lessonSave.id}`, lessonToSave);
            if (Resource.isError(data)) {
                return rejectWithValue(data.message);
            }
            return data.data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const { resetLesson, setCategoryId, updateLesson, addNewLesson, updateName, updateContent, addNewWord, updateWord, deleteWord, resetSaveLesson } = lessonSlice.actions;
export default lessonSlice.reducer;