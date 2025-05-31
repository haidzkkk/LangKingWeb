import PropTypes from 'prop-types';
import LessonCard from '../lesson/LessonCard';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import DialogComfirm from '../../components/DialogConfirm';
import { useDispatch } from 'react-redux';
import { deleteCategory, updateCategory, addNewCategory, resetAddCategory } from './homeSlice';

const CategorySection = ({ category, editMode = false }) => {
    const dispatch = useDispatch();

    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(editMode);
    const [editedName, setEditedName] = useState(category.name);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const isCategoryAdd = !category.id;

    const onClickSave = () => {
        setIsEditing(false);

        if (isCategoryAdd) {
            dispatch(addNewCategory({
                name: editedName
            }));
            return
        }
        dispatch(updateCategory({
            ...category,
            name: editedName
        }));
    };

    const handleConfirmDelete = () => {
        setIsDeleteDialogOpen(false);
        dispatch(deleteCategory(category));
    };

    const onClickCancel = () => {
        setEditedName(category.name);
        setIsEditing(false);

        if (isCategoryAdd) {
            dispatch(resetAddCategory());
        }
    };

    const onClickDelete = (e) => {
        e.stopPropagation();

        if (isCategoryAdd) {
            dispatch(resetAddCategory());
            return;
        }
        
        setIsDeleteDialogOpen(true);
    };

    return (
        <div className="mb-12 pb-12 border-b border-gray-500 last:border-b-0 last:pb-0">
            <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                    {isEditing ? (
                        <div className="flex items-center gap-3">
                            <input
                                type="text"
                                value={editedName}
                                onChange={(e) => setEditedName(e.target.value)}
                                className="text-2xl font-bold text-gray-800 border-b border-gray-300 focus:border-green-500 outline-none px-2"
                                autoFocus
                            />
                            <div className="flex items-center gap-2">
                                <button onClick={onClickCancel} className="text-gray-500 hover:text-gray-700" title="Hủy sửa">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                </button>
                                <button onClick={onClickDelete} className="text-gray-500 hover:text-red-600" title="Xóa thể loại này">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                </button>
                                <button onClick={onClickSave} className="text-green-600 hover:text-green-700" title="Lưu tên">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    ) : (
                        <>
                            <h2 className="text-2xl font-bold text-gray-800">{category.name}</h2>
                            <div className="flex items-center gap-2">
                                <button onClick={() => setIsEditing(true)} className="text-gray-500 hover:text-green-600" title="Chỉnh sửa">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                    </svg>
                                </button>
                            </div>
                        </>
                    )}
                </div>
                <h4
                    onClick={() => navigate(`/lesson?categoryId=${category.id}`)}
                    className="text-black hover:text-green-700 inline-flex items-center gap-2 cursor-pointer text-1xl font-bold leading-none"
                >
                    <span className="leading-none">Thêm bài học</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 relative top-[1px]" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                </h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {category.lessons && Object.entries(category.lessons).map(([id, lesson]) => (
                    <LessonCard
                        key={id}
                        isEditing={isEditing}
                        lesson={lesson}
                        categoryId={category.id}
                    />
                ))}
            </div>
            <DialogComfirm
                isOpen={isDeleteDialogOpen}
                onClose={() => setIsDeleteDialogOpen(false)}
                onConfirm={handleConfirmDelete}
                title={`Xóa thể loại?`}
                content={`Bạn có chắc chắn muốn xóa thể loại "${category.name}"?`}
            />
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