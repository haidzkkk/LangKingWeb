import PropTypes from 'prop-types';
import { useEffect, useRef } from 'react';

export default function DialogComfirm({ isOpen, onClose, onConfirm, title, content }) {
    if (!isOpen) return null;

    const dialogRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dialogRef.current && !dialogRef.current.contains(event.target)) {
                onClose();
            }
        };

        document.addEventListener("mouseup", handleClickOutside);
        return () => document.removeEventListener("mouseup", handleClickOutside);
    }, []);

    return (
        <div className="fixed inset-0 bg-black/10 backdrop-blur-[2px] z-50 flex items-end justify-center sm:items-center">
            <div className="bg-white/95 w-full max-w-sm rounded-t-2xl sm:rounded-2xl overflow-hidden shadow-xl">
                <div
                    ref={dialogRef}
                    className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">{title ?? "Xác nhận"}</h3>
                    <p className="text-gray-600 mb-6">{content}</p>
                    <div className="flex flex-col gap-2">
                        <button
                            onClick={onConfirm}
                            className="w-full py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors"
                        >
                            Xác nhận
                        </button>
                        <button
                            onClick={onClose}
                            className="w-full py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
                        >
                            Hủy
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

DialogComfirm.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onConfirm: PropTypes.func.isRequired,
    title: PropTypes.string,
    content: PropTypes.string.isRequired,
};