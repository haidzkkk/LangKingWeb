import { configureStore } from '@reduxjs/toolkit';
import homeReducer from '../compoment/home/homeSlice'
import lessonReducer from '../compoment/lesson/LessonSlice'
import authReducer from '../compoment/auth/AuthSlice'
import userReducer from '../compoment/user/UserSlice'
const rootStore = configureStore({
    reducer: {
        homeState: homeReducer,
        lessonState: lessonReducer,
        authState: authReducer,
        userState: userReducer,
    }
})

export default rootStore