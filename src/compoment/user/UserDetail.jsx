import { useState, useEffect } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getEditUserById, updateUser, clearFromEditUser, clearUpdateStatus } from './UserSlice';
import ic_avatar from '../../assets/imoji_avatar.png';
import { Resource } from '../../data/model/resouce';
import { toast } from 'react-toastify';

const UserDetail = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const userId = useParams().id;

    const { currentUser } = useSelector(state => state.authState);
    const { currentUserEdit, updateStatus } = useSelector(state => state.userState);

    const [isEditing, setIsEditing] = useState(false);
    const [editedData, setEditedData] = useState(null);


    useEffect(() => {
        dispatch(getEditUserById(userId));
        return () => {
            dispatch(clearFromEditUser());
            dispatch(clearUpdateStatus());
        };
    }, [userId, dispatch]);

    useEffect(() => {
        if (Resource.isSuccess(currentUserEdit) && currentUserEdit.data) {
            setEditedData(currentUserEdit.data);
        }
    }, [currentUserEdit]);

    useEffect(() => {
        if (Resource.isSuccess(updateStatus)) {
            toast.success('Cập nhật thông tin thành công!');
            setIsEditing(false);
            dispatch(clearUpdateStatus());
        } else if (Resource.isError(updateStatus)) {
            toast.error(updateStatus.message || 'Cập nhật thông tin thất bại!');
            dispatch(clearUpdateStatus());
        }
    }, [updateStatus, dispatch]);

    const handleChange = (field, value) => {
        setEditedData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSubmit = async () => {
        if (!editedData) return;
        dispatch(updateUser(editedData));
    };

    const handleBack = () => {
        if (location.key !== "default") {
            navigate(-1);
        } else {
            navigate('/user');
        }
    };

    const toggleEdit = () => {
        if (isEditing) {
            handleSubmit();
        } else {
            setIsEditing(true);
        }
    };

    // Loading state
    if (Resource.isLoading(currentUserEdit)) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
            </div>
        );
    }

    // Error state
    if (Resource.isError(currentUserEdit)) {
        return (
            <div className="container mx-auto px-4 py-8">
                <button onClick={handleBack} className="flex items-center text-gray-600 hover:text-green-600 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    <p className="ml-2">Quay lại</p>
                </button>
                <div className="text-center mt-8">
                    <p className="text-red-500 text-lg">{currentUserEdit.error || 'Có lỗi xảy ra khi tải thông tin người dùng'}</p>
                </div>
            </div>
        );
    }

    // Null check
    if (!currentUserEdit.data || !editedData) {
        return (
            <div className="container mx-auto px-4 py-8">
                <button onClick={handleBack} className="flex items-center text-gray-600 hover:text-green-600 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    <p className="ml-2">Quay lại</p>
                </button>
                <div className="text-center mt-8">
                    <p className="text-gray-500 text-lg">Không tìm thấy thông tin người dùng</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <button
                onClick={handleBack}
                className="flex items-center text-gray-600 hover:text-green-600 transition-colors"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 19l-7-7m0 0l7-7m-7 7h18"
                    />
                </svg>
                <p className="ml-2">Quay lại</p>
            </button>
            <div className="max-w-3xl mx-auto bg-gray-100 rounded-lg shadow-md overflow-hidden">
                <div className="md:flex">
                    <div className="md:w-1/3 bg-green-100 p-8 flex flex-col items-center">
                        <div className="w-48 h-48 rounded-full overflow-hidden mb-4 border-4 border-white shadow-lg">
                            <img
                                src={editedData.avatar || ic_avatar}
                                alt={editedData.fullName || editedData.username}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <button
                            onClick={toggleEdit}
                            disabled={Resource.isLoading(updateStatus)}
                            className={`mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center ${
                                Resource.isLoading(updateStatus) ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                        >
                            {Resource.isLoading(updateStatus) ? (
                                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                </svg>
                            )}
                            {isEditing ? 'Lưu thay đổi' : 'Chỉnh sửa'}
                        </button>
                    </div>

                    {/* Right side - User Information */}
                    <div className="md:w-2/3 p-8">
                        <div className="mb-6">
                            <h1 className="text-2xl font-bold text-gray-800 mb-2">
                                Thông tin người dùng
                            </h1>
                            <div className="h-1 w-20 bg-green-500"></div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-600">Tên đăng nhập</label>
                                <input
                                    type="text"
                                    value={editedData.username}
                                    disabled={true}
                                    className={`mt-1 block w-full px-3 py-2 rounded-md bg-white ${
                                        isEditing
                                            ? 'border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500'
                                            : 'border-transparent'
                                    }`}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-600">Email</label>
                                <input
                                    type="email"
                                    value={editedData.email}
                                    onChange={(e) => handleChange('email', e.target.value)}
                                    disabled={!isEditing || Resource.isLoading(updateStatus)}
                                    className={`mt-1 block w-full px-3 py-2 rounded-md bg-white ${
                                        isEditing
                                            ? 'border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500'
                                            : 'border-transparent'
                                    }`}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-600">Họ và tên</label>
                                <input
                                    type="text"
                                    value={editedData.fullName}
                                    onChange={(e) => handleChange('fullName', e.target.value)}
                                    disabled={!isEditing || Resource.isLoading(updateStatus)}
                                    className={`mt-1 block w-full px-3 py-2 rounded-md bg-white ${
                                        isEditing
                                            ? 'border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500'
                                            : 'border-transparent'
                                    }`}
                                />
                            </div>

                            {isEditing && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-600">Mật khẩu</label>
                                    <input
                                        type="password"
                                        placeholder="Nhập mật khẩu mới"
                                        onChange={(e) => handleChange('password', e.target.value)}
                                        disabled={Resource.isLoading(updateStatus)}
                                        className="mt-1 block w-full px-3 py-2 rounded-md bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                    />
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-gray-600">Vai trò</label>
                                <select
                                    value={editedData.role}
                                    onChange={(e) => handleChange('role', e.target.value)}
                                    disabled={!isEditing || currentUser.data.id === editedData.id || Resource.isLoading(updateStatus)}
                                    className={`mt-1 block w-full px-3 py-2 rounded-md bg-white bg-white  ${
                                        isEditing
                                            ? 'border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500'
                                            : 'border-transparent'
                                    }`}
                                >
                                    <option value="USER">Người dùng</option>
                                    <option value="ADMIN">Quản trị viên</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserDetail;