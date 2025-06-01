import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import DialogComfirm from '../../components/DialogConfirm';
import { useDispatch } from 'react-redux';
import { deleteLesson } from '../home/homeSlice';
import banner from '../../assets/banner.png';

const LessonCard = ({ lesson, categoryId, isEditing }) => {
    const dispatch = useDispatch();

    const navigate = useNavigate();
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    const onClickDelete = (e) => {
        e.stopPropagation();
        setIsDeleteDialogOpen(true);
    };

    const handleConfirmDelete = () => {
        dispatch(deleteLesson({categoryId, lesson}));
        setIsDeleteDialogOpen(false);
    };

    return (
        <>
            <div
                className="relative flex flex-col bg-gray-100 items-center p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow group cursor-pointer"
                onClick={() => navigate(`/lesson?lessonId=${lesson.id}&categoryId=${categoryId}`)}
            >
                {isEditing && (
                    <button
                        onClick={onClickDelete}
                        className="absolute top-2 right-2 z-10 p-1.5 bg-white rounded-full shadow-md text-gray-500 hover:text-red-600 transition-colors"
                        title="Xóa bài học này"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                    </button>
                )}
                <div className="w-full h-48 overflow-hidden rounded-lg">
                    <img
                        src={lesson.imageUrl || banner}
                        alt={lesson.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-140"
                    />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-center">{lesson.name}</h3>
            </div>
            <DialogComfirm
                isOpen={isDeleteDialogOpen}
                onClose={() => setIsDeleteDialogOpen(false)}
                onConfirm={handleConfirmDelete}
                title={`Xóa bài học?`}
                content={`Bạn có chắc chắn muốn xóa bài học "${lesson.title}"?`}
            />
        </>
    );
};

LessonCard.propTypes = {
    title: PropTypes.string.isRequired,
    imageUrl: PropTypes.string,
    lessonId: PropTypes.string.isRequired,
    categoryId: PropTypes.string.isRequired,
    isEditing: PropTypes.bool
};

LessonCard.defaultProps = {
    isEditing: false
};

export default LessonCard;