import React from 'react'
import { useHolidays } from '../apis/googleCalendar'
import { useSession } from '@supabase/auth-helpers-react'

export const HolidaysContext = React.createContext({})

function holidaysContextProvider(props: { children: React.ReactNode }) {

    const session = useSession()

    const { data, isLoading, error } = useHolidays('en.uk', session)

    const { children } = props
    const values = {
        holidays: data?.items
    }

    return (
        <HolidaysContext.Provider value={values}>
            {children}
        </HolidaysContext.Provider >
    )
}

export default holidaysContextProvider