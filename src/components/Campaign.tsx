import React from 'react'
import { useParams } from 'react-router'

function Campaign() {

    const params = useParams()

    console.log(params)
    console.log('hello')
    return (
        <div>Campaign</div>
    )
}

export default Campaign