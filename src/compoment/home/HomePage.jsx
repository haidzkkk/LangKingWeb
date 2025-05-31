import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { listenToCategories, resetConfirmData, setNewCategory } from './homeSlice';
import CategorySection from './CategorySection';
import { ToastContainer, toast } from 'react-toastify';
import { Resource } from '../../data/model/resouce';

const HomePage = () => {
    const dispatch = useDispatch();
    const { categories, confirmData, currentAddCategory } = useSelector(state => state.homeState);


    useEffect(() => {
        const unsubscribe = listenToCategories(dispatch);

        return () => {
            unsubscribe();
        };
    }, []);


    useEffect(() => {
        if (!Resource.isInitialize(confirmData)) {
            if (Resource.isError(confirmData)) {
                toast.error(confirmData.message);
            } else if (Resource.isSuccess(confirmData)) {
                toast.success(confirmData.message);
            }
            dispatch(resetConfirmData());
        }
    }, [confirmData, dispatch]);


    const onClickAddCategory = () => {
        dispatch(setNewCategory({
            name: 'New Category',
        }));
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
            duration: 500
        });
    };

    return (
        <div className='container mx-auto px-4 py-8'>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Danh sách thể loại</h1>
                <button
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    onClick={onClickAddCategory}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    Thêm thể loại
                </button>
            </div>
            {categories.data && categories.data.map(category => (
                <CategorySection key={category.id} category={category} />
            ))}
            {Resource.isSuccess(currentAddCategory) && (
                <CategorySection category={currentAddCategory.data} editMode={true} />
            )}
        </div>
    );
}

export default HomePage