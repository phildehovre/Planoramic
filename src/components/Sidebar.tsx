import React, { SetStateAction, useContext, useEffect } from 'react'
import './Sidebar.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBoltLightning, faBullhorn, faClone, } from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from 'react-router'
import { PostgrestSingleResponse } from '@supabase/supabase-js'
import { selectedTemplateContext } from '../contexts/SelectedTemplateContext'
import { selectedCampaignContext } from '../contexts/SelectedCampaignContext'
import Create from './Create'
'../contexts/SelectedTemplateContext'

function Sidebar(props: {
    ressources: any[]
    ressourceType: string | undefined
}) {

    const {
        ressources
    } = props

    const navigate = useNavigate()
    const [displayRessources, setDisplayRessources] = React.useState<SetStateAction<string>>('')
    const [sidebarContent, setSidebarContent] = React.useState('')

    const { setSelectedTemplateId } = useContext(selectedTemplateContext)
    const { setSelectedCampaignId } = useContext(selectedCampaignContext)

    const renderData = () => {
        return ressources?.map((ressource: any) => {
            const type = ressource.type.slice(0, -1)
            return (
                <React.Fragment key={ressource.type} >
                    <h4

                        style={{ cursor: 'pointer' }}
                        onClick={() => {
                            setDisplayRessources((prev: string) => {
                                if (prev?.length) {
                                    return ''
                                }
                                else {
                                    return ressource.type
                                }
                            })
                        }}
                    >{ressource.type.toUpperCase()}</h4>
                    {displayRessources === ressource.type &&
                        ressource.data.map((item: any) => {
                            return (
                                <div
                                    key={item.id}
                                    className='sidebar-content__item'
                                    onClick={() => { navigate(`/dashboard/${type}/${item[`${type}_id`]}`) }}
                                >{item.name}</div>
                            )
                        })
                    }
                    {displayRessources === ressource.type && <Create ressourceType={type} />}

                </React.Fragment>
            )
        })
    }


    return (
        <div className='sidebar'>
            <div className={`sidebar-content`}>
                {renderData()}
            </div>
        </div>
    )
}

export default Sidebar

