export const testForAbsenceOfDates = (events: any) => {
    let notification: { content?: string, type?: string, title?: string } = {}
    let count = 0

    console.log(events.some((row: any) => !row.position || !row.position_units))
    notification.title = 'Error: Missing dates'
    notification.type = 'error'
    notification.content = `Please fill in all the dates: ${count} missing dates`
}