import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import loginBanner from '../../assets/banner.png';
import { useDispatch, useSelector } from 'react-redux';
import { authUserByUsername, setLoginFormData } from './AuthSlice';
import { Resource } from '../../data/model/resouce';

const Login = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [showPassword, setShowPassword] = useState(false);

    const { loginConfirm, loginFormData } = useSelector((state) => state.authState);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        dispatch(setLoginFormData({
            ...loginFormData,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        dispatch(authUserByUsername(loginFormData));
    };

    useEffect(() => {
        if (Resource.isSuccess(loginConfirm)) {
            navigate('/home');
        }
    }, [loginConfirm, dispatch, navigate]);

    return (
        <>
            {Resource.isLoading(loginConfirm) && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div className="absolute inset-0 bg-white opacity-10"></div>
                    <div className="relative">
                        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-500"></div>
                    </div>
                </div>
            )}
            <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl w-full flex bg-white rounded-2xl shadow-lg overflow-hidden">
                    {/* Left side - Image */}
                    <div className="hidden md:block w-1/2">
                        <img
                            src={loginBanner}
                            alt="Login"
                            className="w-full h-full object-cover"
                        />
                    </div>

                    {/* Right side - Login form */}
                    <div className="w-full md:w-1/2 p-8 space-y-8">
                        <div>
                            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                                Đăng nhập
                            </h2>
                            <p className="mt-2 text-center text-sm text-gray-600">
                                Hoặc{' '}
                                <button onClick={() => navigate('/register')} className="font-medium text-green-600 hover:text-green-500">
                                    đăng ký tài khoản mới
                                </button>
                            </p>
                        </div>

                        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                            <div className={`${Resource.isError(loginConfirm) ? 'text-red-600' : 'text-green-600'} text-sm text-center`}>
                                {Resource.isLoading(loginConfirm) ? "Đang đăng nhập..." : Resource.isError(loginConfirm) ? loginConfirm.message : "Hãy đăng nhập để tiếp tục"}
                            </div>

                            <div className="rounded-md shadow-sm space-y-4">
                                <div>
                                    <label htmlFor="Username" className="block text-sm font-medium text-gray-700">
                                        Username
                                    </label>
                                    <input
                                        id="username"
                                        name="username"
                                        required
                                        value={loginFormData.username}
                                        onChange={handleChange}
                                        className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                                        placeholder="Tên đăng nhập của bạn"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="Password" className="block text-sm font-medium text-gray-700">
                                        Mật khẩu
                                    </label>
                                    <div className="relative">
                                        <input
                                            id="password"
                                            name="password"
                                            type={showPassword ? "text" : "password"}
                                            autoComplete="current-password"
                                            required
                                            value={loginFormData.password}
                                            onChange={handleChange}
                                            className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm pr-10"
                                            placeholder="Mật khẩu của bạn"
                                        />
                                        <button
                                            type="button"
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? (
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-500">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                                                </svg>
                                            ) : (
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-500">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="text-sm">
                                    <button onClick={() => navigate('/forgot-password')} className="font-medium text-green-600 hover:text-green-500">
                                        Quên mật khẩu?
                                    </button>
                                </div>
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                >
                                    Đăng nhập
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Login;