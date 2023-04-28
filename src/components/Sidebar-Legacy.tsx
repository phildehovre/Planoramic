import React, { useContext } from 'react'
import './Sidebar.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBoltLightning, faBullhorn, faClone, } from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from 'react-router'
import { PostgrestSingleResponse } from '@supabase/supabase-js'
import { selectedTemplateContext } from '../contexts/SelectedTemplateContext'
import { selectedCampaignContext } from '../contexts/SelectedCampaignContext'
import Create from './Create'
'../contexts/SelectedTemplateContext'

function Sidebar(props: { ressource: PostgrestSingleResponse<{ [x: string]: any; }[]> | undefined }) {

    const { ressource } = props

    const navigate = useNavigate()
    const [showSidebar, setShowSidebar] = React.useState(false)
    const [sidebarContent, setSidebarContent] = React.useState('')

    const { setSelectedTemplateId } = useContext(selectedTemplateContext)
    const { setSelectedCampaignId } = useContext(selectedCampaignContext)

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

    console.log(sidebarContent)

    const renderData = () => {
        let type = sidebarContent
        return ressource?.data?.map((item: any) => {
            return (
                <div className='sidebar-content__item' key={item.id}>
                    <div
                        className='sidebar-content__item__title'
                        onClick={() => {
                            if (type === 'template') {
                                setSelectedTemplateId(item.template_id)
                                setSelectedCampaignId(undefined)
                            }
                            if (type === 'campaign') {
                                setSelectedTemplateId(item.template_id)
                                setSelectedCampaignId(item.campaign_id)
                            }

                            navigate(`/dashboard/${sidebarContent.toLowerCase()}/${item[type + '_id']}`)
                        }}
                    >{item.name}</div>
                </div>
            )
        })
    }

    return (
        <div className='sidebar'>
            <div className='sidebar_btn-ctn'>
                <h2 style={{ padding: '0', margin: '0' }} onClick={() => navigate('/')}>Home</h2>

                <button onClick={() => handleButtonClick('template')}>
                    <FontAwesomeIcon icon={faClone} />
                </button>
                <button onClick={() => handleButtonClick('campaign')}>
                    <FontAwesomeIcon icon={faBullhorn} />

                </button>
                <button onClick={() => handleButtonClick('task')}>
                    <FontAwesomeIcon icon={faBoltLightning} />

                </button>
            </div>
            {
                showSidebar && (
                    <div className={`sidebar-content ${showSidebar ? 'showing' : ''}`}>
                        <h4>{sidebarContent}</h4>
                        {renderData()}
                        <Create ressourceType={sidebarContent} />
                    </div>
                )
            }
        </div>
    )
}

export default Sidebar

