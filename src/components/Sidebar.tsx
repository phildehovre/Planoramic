import React from 'react'
import './Sidebar.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBoltLightning, faBullhorn, faClone, } from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from 'react-router'

function Sidebar() {

    const navigate = useNavigate()
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
        navigate(`/dashboard/${type.toLowerCase()}`)
    }

    console.log(showSidebar, sidebarContent)

    return (
        <div className='sidebar'>
            <div className='sidebar_btn-ctn'>

                <button onClick={() => handleButtonClick('Templates')}>
                    <FontAwesomeIcon icon={faClone} />
                </button>
                <button onClick={() => handleButtonClick('Campaigns')}>
                    <FontAwesomeIcon icon={faBullhorn} />

                </button>
                <button onClick={() => handleButtonClick('Tasks')}>
                    <FontAwesomeIcon icon={faBoltLightning} />

                </button>
            </div>
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