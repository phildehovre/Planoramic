import React from 'react'
import './Sidebar.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBoltLightning, faBullhorn, faClone, } from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from 'react-router'
import { PostgrestSingleResponse } from '@supabase/supabase-js'

function Sidebar(props: { ressource: PostgrestSingleResponse<{ [x: string]: any; }[]> | undefined }) {

    const { ressource } = props

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


    const renderData = () => {
        let type = sidebarContent.slice(0, -1).toLowerCase()
        console.log(type)
        return ressource?.data?.map((item: any) => {
            return (
                <div className='sidebar-content__item' key={item.id}>
                    <div
                        className='sidebar-content__item__title'
                        onClick={() => navigate(`/dashboard/${sidebarContent.toLowerCase()}/${item[type + '_id']}`)}
                    >{item.name}</div>
                </div>
            )
        })
    }

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
                        {renderData()}
                    </div>
                )
            }
        </div>
    )
}

export default Sidebar