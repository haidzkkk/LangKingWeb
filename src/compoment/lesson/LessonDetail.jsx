import { useEffect, useState, useMemo } from 'react';
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { getLeson, resetLesson, updateLesson } from './LessonSlice';
import { Resource } from '../../data/model/resouce';
import WordItem from './WordItem';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const LessonDetail = () => {
    const [searchParams] = useSearchParams();
    const lessonId = searchParams.get('lessonId');
    const categoryId = searchParams.get('categoryId');
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const { lesson } = useSelector(state => state.lessonState);
    const [lessonName, setLessonName] = useState('');
    const [lessonContent, setLessonContent] = useState('');

    const handleEdit = (word) => {
        console.log('Edit word:', word);
    };

    const handleDelete = (wordId) => {
        console.log('Delete word:', wordId);
    };

    useEffect(() => {
            dispatch(getLeson({ categoryId, lessonId }));
    }, [lessonId, categoryId, dispatch]);

    useEffect(() => {
        if (Resource.isSuccess(lesson)) {
            setLessonName(lesson.data.name);
            setLessonContent(lesson.data.content);
        }
    }, [lesson]);

    useEffect(() => {
        window.scrollTo(0, 0);

        return () => {
            dispatch(resetLesson());
        };
    }, []);

    const handleTextAreaHeight = (e) => {
        const textarea = e.target;
        const scrollPos = window.scrollY;
        textarea.style.height = 'auto';
        textarea.style.height = textarea.scrollHeight + 'px';
        window.scrollTo(0, scrollPos);
    };

    useEffect(() => {
        const textarea = document.querySelector('textarea');
        if (textarea) {
            const scrollPos = window.scrollY;
            textarea.style.height = 'auto';
            textarea.style.height = textarea.scrollHeight + 'px';
            window.scrollTo(0, scrollPos);
        }
    }, [lessonContent]);

    const handleBack = () => {
        if (location.key !== "default") {
            navigate(-1);
        } else {
            navigate('/');
        }
    };

    const handleDragEnd = (result) => {
        if (!result.destination || !lesson.data.words) return;

        const wordEntries = Object.entries(lesson.data.words);
        const items = Array.from(wordEntries);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);

        const reorderedWords = Object.fromEntries(
            items.map(([key, word], index) => [
                key,
                { ...word, position: index + 1 }
            ])
        );

        dispatch(updateLesson({
            ...lesson.data,
            words: reorderedWords
        }));
    };

    // Memoize the sorted word entries to prevent unnecessary re-renders
    const sortedWordEntries = useMemo(() => {
        if (!lesson.data?.words) return [];
        return Object.entries(lesson.data.words)
            .sort(([, a], [, b]) => (a.position || 0) - (b.position || 0))
            .map(([key, value], index) => ({
                id: `word-item-${Math.abs(parseInt(key))}-${index}`,
                key,
                value
            }));
    }, [lesson.data?.words]);

    console.log("lesson.status: ", lesson.status);
    if (Resource.isLoading(lesson)) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
            </div>
        );
    }

    if (Resource.isError(lesson)) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <h2 className="text-2xl font-bold text-gray-800">Lesson not found</h2>
                <p className="mt-2 text-gray-600">The lesson you're looking for doesn't exist.</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mx-auto">
                <div className="fixed top-[62px] left-0 right-0 bg-white shadow-md z-10">
                    <div className="container mx-auto px-4">
                        <div className="flex justify-between items-center py-4">
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
                            <div className="mx-8">
                                <input
                                    type="text"
                                    value={lessonName}
                                    onChange={(e) => setLessonName(e.target.value)}
                                    className="bg-transparent border-b border-gray-300 focus:border-green-500 px-2 py-1 outline-none text-gray-700 font-medium text-center min-w-[300px]"
                                />
                            </div>
                            <button
                                onClick={() => {

                                }}
                                className="flex items-center ml-5 mr-5 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5 mr-2"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M8 4H6a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V7.414A2 2 0 0019.414 6L14 2H6a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V7.414A2 2 0 0019.414 6L14 2H6a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V7.414A2 2 0 0019.414 6L14 2"
                                    />
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M16 8v-4"
                                    />
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M8 12h8"
                                    />
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M8 16h8"
                                    />
                                </svg>
                                Lưu
                            </button>
                        </div>
                    </div>
                </div>

                <div className="mt-[72px] mb-8">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Nội dung bài học</h2>
                    <textarea
                        value={lessonContent}
                        onChange={(e) => {
                            setLessonContent(e.target.value);
                            handleTextAreaHeight(e);
                        }}
                        className="w-full p-4 border border-gray-300 rounded-lg focus:border-green-500 outline-none text-gray-700 font-medium overflow-hidden"
                        placeholder="Nhập nội dung bài học..."
                        rows={1}
                    />
                </div>

                <div className="mb-8">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-4">
                            <h2 className="text-xl font-bold text-gray-900">Từ vựng</h2>
                        </div>
                        <button
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center"
                            onClick={() => console.log('Add new word')}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                            </svg>
                            Add Word
                        </button>
                    </div>
                </div>

                {Resource.isSuccess(lesson) && sortedWordEntries.length > 0 && (
                    <DragDropContext onDragEnd={handleDragEnd}>
                        <Droppable droppableId="droppable-words">
                            {(provided) => (
                                <div
                                    {...provided.droppableProps}
                                    ref={provided.innerRef}
                                    className="grid grid-cols-1 gap-4"
                                >
                                    {sortedWordEntries.map((item, index) => (
                                        <Draggable
                                            key={item.id}
                                            draggableId={item.id}
                                            index={index}
                                        >
                                            {(provided, snapshot) => (
                                                <div
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                    className={`flex items-start gap-4 ${
                                                        snapshot.isDragging ? 'opacity-50' : ''
                                                    }`}
                                                >
                                                    <h1 className="text-3xl font-bold text-gray-400 mt-4">
                                                        {index + 1}.
                                                    </h1>
                                                    <div className="flex-1">
                                                        <WordItem
                                                            word={item.value}
                                                            onEdit={handleEdit}
                                                            onDelete={handleDelete}
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </DragDropContext>
                )}
            </div>
        </div>
    );
};

export default LessonDetail;