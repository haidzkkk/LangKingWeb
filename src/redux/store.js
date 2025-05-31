import { configureStore } from '@reduxjs/toolkit';
import homeReducer from '../compoment/home/homeSlice'
import lessonReducer from '../compoment/lesson/LessonSlice'

const rootStore = configureStore({
    reducer: {
        homeState: homeReducer,
        lessonState: lessonReducer
    }
})

export default rootStore