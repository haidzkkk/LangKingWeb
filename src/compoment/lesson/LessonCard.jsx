import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

const LessonCard = ({ title, imageUrl, lessonId, categoryId }) => {
    const navigate = useNavigate();

    return (
        <div
            className="flex flex-col items-center p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow group cursor-pointer"
            onClick={() => navigate(`/lesson?lessonId=${lessonId}&categoryId=${categoryId}`)}
        >
            <div className="w-full h-48 overflow-hidden rounded-lg">
                <img
                    src={imageUrl || 'https://placehold.co/300x200'}
                    alt={title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-140"
                />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-center">{title}</h3>
        </div>
    );
};

LessonCard.propTypes = {
    title: PropTypes.string.isRequired,
    imageUrl: PropTypes.string,
    lessonId: PropTypes.string.isRequired
};

export default LessonCard;