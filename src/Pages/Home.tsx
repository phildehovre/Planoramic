import React from 'react'
import { Link } from 'react-router-dom'
import Page from '../components/Page'
import HomepageLayout from '../layouts/HomepageLayout'
import Hero from '../components/Hero'
import Navbar from '../components/Navbar'

function Home() {
    return (
        <Page>
            <HomepageLayout navbar={<Navbar />} body={<Hero />} />
        </Page>
    )
}

export default Home