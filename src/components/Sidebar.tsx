import React from 'react'
import './Sidebar.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBoltLightning, faBullhorn, faClone, } from '@fortawesome/free-solid-svg-icons'

function Sidebar() {
    const [showSidebar, setShowSidebar] = React.useState(false)
    const [sidebarContent, setSidebarContent] = React.useState('')

    const handleButtonClick = (type: string | '') => {
        if (type === sidebarContent) {
            setShowSidebar(false)
            setSidebarContent('')
        }
        if (type !== sidebarContent) {
            setShowSidebar(true)
            setSidebarContent(type)
        }
    }


    return (
        <div className='sidebar'>
            <button onClick={() => handleButtonClick('Templates')}>
                <FontAwesomeIcon icon={faClone} />
            </button>
            <button onClick={() => handleButtonClick('Campaigns')}>
                <FontAwesomeIcon icon={faBullhorn} />

            </button>
            <button onClick={() => handleButtonClick('Tasks')}>
                <FontAwesomeIcon icon={faBoltLightning} />

            </button>
            {
                showSidebar && (
                    <div className={`sidebar-content ${showSidebar ? 'showing' : ''}`}>
                        <h4>{sidebarContent}</h4>
                    </div>
                )
            }
        </div>
    )
}

export default Sidebar