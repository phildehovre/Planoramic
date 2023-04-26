import React, { useEffect, useRef, useState } from 'react';
import './Modal.scss';

interface ModalProps {
    onClose: () => void;
    onSave: () => void;
    showModal: boolean;
    setShowModal: (showModal: boolean) => void;
    title: string;
    content?: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({
    onClose,
    onSave,
    showModal,
    setShowModal,
    title,
    content: Content
}) => {


    const saveButtonRef = useRef<HTMLButtonElement>(null);

    const handleSaveClick = () => {
        setShowModal(false);
        onSave();
    };

    const handleOutsideClick = (event: React.MouseEvent<HTMLDivElement>) => {
        if ((event.target as HTMLDivElement).classList.contains('modal-overlay')) {
            setShowModal(false);
            onClose();
        }
    };

    const handleCloseClick = () => {
        setShowModal(false);
        onClose();
    };

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Enter') {
                event.preventDefault();
                saveButtonRef.current?.click();
            }
        };

        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    return (
        <>
            {showModal && (
                <div className="modal-overlay" onClick={handleOutsideClick}>
                    <div className="modal">
                        <button type="button" className="modal-close" onClick={handleCloseClick}>X</button>
                        <div className="modal-content">
                            <h2>{title}</h2>
                            {Content}
                        </div>
                        <div className="modal-footer">
                            <button type="button" onClick={handleSaveClick} ref={saveButtonRef}>Save</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Modal;
