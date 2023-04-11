import React from 'react'
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react'
import { useNavigate } from 'react-router-dom'
import Spinner from './Spinner'



function SupabaseLogin(props: { redirect: string }) {

    const { redirect } = props

    const [isLoading, setIsLoading] = React.useState<boolean>()


    const supabase = useSupabaseClient(); // talk to supabase
    const navigate = useNavigate()

    async function googleSignIn() {
        setIsLoading(true)
        try {
            await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    scopes: 'https://www.googleapis.com/auth/calendar', // scopes must be seperated by a space, under the same string. 
                    redirectTo: window.location.origin
                }
            },
            );
        }
        catch (error) {
            alert('Error logging in to Google with Supabase')
        }
        finally {
            setIsLoading(false)
        }
    }


    return (
        <>
            <button
                onClick={() => { googleSignIn().then(() => navigate(redirect)) }}>
                Log in
            </button>
        </>


    )
}

export default SupabaseLogin