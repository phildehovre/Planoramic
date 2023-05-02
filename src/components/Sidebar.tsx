import React, { SetStateAction, useEffect } from 'react'
import './Sidebar.scss'
import { useNavigate } from 'react-router'
import Create from './Create'
import { useParams } from 'react-router-dom'
'../contexts/SelectedTemplateContext'

function Sidebar(props: {
    ressources: any[]
    ressourceType: string | undefined
}) {

    const {
        ressources
    } = props

    const navigate = useNavigate()
    const params = useParams()

    const [displayRessources, setDisplayRessources] = React.useState<SetStateAction<string>>('')


    useEffect(() => {
        if (params.ressource === 'campaigns') {
            setDisplayRessources('campaign')
        }
        if (params.ressource === 'templates') {
            setDisplayRessources('template')
        }
        console.log(params.ressource)

    })

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

