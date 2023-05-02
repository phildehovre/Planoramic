// useEffect(() => {
//     if (templateEvents?.data?.data && templateEvents?.data?.data.length > 0) {
//         console.log('Creating new template')
//         const newTemplateId = uuidv4()
//         setNewTemplateEvents({
//             ...templateEvents,
//             data: {
//                 ...templateEvents.data,
//                 isLoading: false,
//                 data: templateEvents.data.data.map((event: any) => ({ ...event, template_id: newTemplateId }))
//             }
//         })
//     }
    // 1. Overwrite the Id for all events in the template.
    // 2. Create new template with same ID
    // SelectTemplateId in template context
    // 4. Open both intable and table header
// }, [templateEvents])