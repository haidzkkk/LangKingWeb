import { configureStore } from '@reduxjs/toolkit';
import homeReducer from '../compoment/home/homeSlice.js'
import lessonReducer from '../compoment/lesson/LessonSlice.js'
import authReducer from '../compoment/auth/AuthSlice.js'
import userReducer from '../compoment/user/UserSlice.js'
const rootStore = configureStore({
    reducer: {
        homeState: homeReducer,
        lessonState: lessonReducer,
        authState: authReducer,
        userState: userReducer,
    }
})

export default rootStore