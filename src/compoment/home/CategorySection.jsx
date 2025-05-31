import PropTypes from 'prop-types';
import LessonCard from '../lesson/LessonCard';
import banner from '../../assets/banner.png';

const CategorySection = ({ category }) => {
    return (
        <div className="mb-12 pb-12 border-b border-gray-200 last:border-b-0 last:pb-0">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">{category.name}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {category.lessons && Object.entries(category.lessons).map(([id, lesson]) => (
                    <LessonCard
                        key={id}
                        title={lesson.name}
                        imageUrl={banner}
                        lessonId={id}
                        categoryId={category.id}
                    />
                ))}
            </div>
        </div>
    );
};

CategorySection.propTypes = {
    category: PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        lessons: PropTypes.arrayOf(
            PropTypes.shape({
                id: PropTypes.string.isRequired,
                name: PropTypes.string.isRequired
            })
        )
    }).isRequired
};

export default CategorySection;