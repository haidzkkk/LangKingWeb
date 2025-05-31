import { useState } from 'react';
import PropTypes from 'prop-types';

const WordItem = ({ word, onEdit, onDelete }) => {
    const [wordData, setWordData] = useState(word);

    const handleChange = (field, value) => {
        const newData = { ...wordData, [field]: value };
        setWordData(newData);
        onEdit(newData);
    };

    return (
        <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start mb-4">
                <div className="flex-1 space-y-3">
                    <div>
                        <label className="block text-lg font-semibold text-gray-700 mb-1">Từ tiếng Anh</label>
                        <input
                            type="text"
                            value={wordData.english}
                            onChange={(e) => handleChange('english', e.target.value)}
                            className="w-full text-gray-600 bg-transparent border border-gray-300 rounded focus:border-green-500 outline-none px-1 py-0.5"
                            placeholder="Nhập từ tiếng Anh..."
                        />
                    </div>
                    <div>
                        <label className="block text-lg font-semibold text-gray-700 mb-1">Phát âm tiếng Anh</label>
                        <input
                            type="text"
                            value={wordData.pronunciation}
                            onChange={(e) => handleChange('pronunciation', e.target.value)}
                            className="w-full text-gray-600 bg-transparent border border-gray-300 rounded focus:border-green-500 outline-none px-1 py-0.5"
                            placeholder="Nhập phát âm tiếng Anh..."
                        />
                    </div>
                    <div>
                        <label className="block text-lg font-semibold text-gray-700 mb-1">Nghĩa tiếng Việt</label>
                        <input
                            type="text"
                            value={wordData.vietnamese}
                            onChange={(e) => handleChange('vietnamese', e.target.value)}
                            className="w-full text-gray-600 bg-transparent border border-gray-300 rounded focus:border-green-500 outline-none px-1 py-0.5"
                            placeholder="Nhập nghĩa tiếng Việt..."
                        />
                    </div>
                </div>
                <div className="flex space-x-2 ml-4">
                    <button
                        onClick={() => onDelete(wordData.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                        title="Delete word"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                    </button>
                </div>
            </div>
            <div className="mt-2 space-y-3">
                <div>
                    <label className="block text-lg font-semibold text-gray-700 mb-1">Mô tả tiếng Anh</label>
                    <textarea
                        value={wordData.description}
                        onChange={(e) => handleChange('description', e.target.value)}
                        className="w-full text-sm text-gray-500 bg-transparent border border-gray-300 rounded focus:border-green-500 outline-none p-2 resize-none"
                        placeholder="Nhập mô tả tiếng Anh..."
                        rows={2}
                    />
                </div>
                <div>
                    <label className="block text-lg font-semibold text-gray-700 mb-1">Mô tả tiếng Việt</label>
                    <textarea
                        value={wordData.descriptionVietnamese}
                        onChange={(e) => handleChange('descriptionVietnamese', e.target.value)}
                        className="w-full text-sm text-gray-500 bg-transparent border border-gray-300 rounded focus:border-green-500 outline-none p-2 resize-none"
                        placeholder="Nhập mô tả tiếng Việt..."
                        rows={2}
                    />
                </div>
            </div>
        </div>
    );
};

WordItem.propTypes = {
    word: PropTypes.shape({
        id: PropTypes.string.isRequired,
        lessonId: PropTypes.string.isRequired,
        english: PropTypes.string,
        pronunciation: PropTypes.string,
        vietnamese: PropTypes.string,
        description: PropTypes.string,
        descriptionVietnamese: PropTypes.string,
        position: PropTypes.number
    }).isRequired,
    onEdit: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired
};

export default WordItem;