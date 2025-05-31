import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { listenToCategories } from './homeSlice';
import CategorySection from './CategorySection';

const HomePage = () => {
    const dispatch = useDispatch();
    const { categories } = useSelector(state => state.homeState);


    useEffect(() => {
        const unsubscribe = listenToCategories(dispatch);

        return () => {
            unsubscribe();
        };
    }, [dispatch]);

    return <div className='container mx-auto px-4 py-8'>
        {categories.data && categories.data.map(category => (
                <CategorySection key={category.id} category={category} />
         ))}
    </div>
}

export default HomePage