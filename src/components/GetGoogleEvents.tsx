import { useSession } from '@supabase/auth-helpers-react';
import React from 'react'

function GetGoogleEvents() {

    const session = useSession()

    // Set up the API endpoint URL
    const calendarId = 'primary';
    const apiEndpoint = `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events`;

    // Set up the request headers
    // const headers = new Headers();
    // headers.append('Authorization', `Bearer ${session?.provider_token}`);
    // headers.append('Accept', 'application/json');

    // Make the HTTP request
    fetch(apiEndpoint, {
        method: 'GET',
        headers: {
            // @ts-ignore
            'Authorization': 'Bearer ' + session?.provider_token
        },
    })
        .then(response => response.json())
        .then(data => {
            // Process the response data
            // console.log(data);
        })
        .catch(error => {
            // Handle the error
            console.error(error);
        });

    return (
        <div></div>
    )
}

export default GetGoogleEvents