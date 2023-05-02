import React, { useEffect } from 'react'
import './ErrorNotification.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClose, faQuestion, faQuestionCircle, faWarning } from '@fortawesome/free-solid-svg-icons'

function ErrorNotification(props: {
    show: boolean,
    content: string
    title: string
    type: 'tips' | 'error' | 'warning'
    onClose: () => void
    ressourceType?: string
    ressource?: any
}): JSX.Element {

    const {
        show,
        content,
        title,
        type,
        onClose,
        ressourceType,
        ressource,
    } = props

    useEffect(() => {
        if (ressourceType === 'campaigns') {
            console.log(ressource)
        }
        if (ressourceType === 'templates') {
            console.log(ressource)
        }
    }, [ressourceType, ressource])

    const renderIcon = () => {
        switch (props.type) {
            case 'tips':
                return <FontAwesomeIcon icon={faQuestionCircle} color='blue' size='lg' />;
            case 'error':
                return <FontAwesomeIcon icon={faWarning} color='red' size='lg' />;
            case 'warning':
                return <FontAwesomeIcon icon={faWarning} color='orange' size='lg' />;
            default:
                return <FontAwesomeIcon icon={faQuestion} color='blue' size='lg' />;
        }
    }

    return (
        <>
            {show &&
                <div className={`notification-ctn ${type}`}>
                    <FontAwesomeIcon icon={faClose} className='close' onClick={onClose} />
                    <span>
                        {renderIcon()}
                        <h3>{title}</h3>
                    </span>
                    <p>{content}</p>
                </div>
            }
        </>
    )
}

export default ErrorNotification