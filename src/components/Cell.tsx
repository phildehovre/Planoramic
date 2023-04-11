import React, { useEffect, useRef } from 'react'

function Cell(props: { value: any, label: string }) {

    const [isEditing, setIsEditing] = React.useState(false);

    const { value, label } = props;


    const cellRef: React.MutableRefObject<any> = useRef()

    useEffect(() => {
        window.addEventListener('click', (e) => {
            try {

                if (cellRef.current !== null && !cellRef.current.contains(e.target)) {
                    setIsEditing(false)
                }
            }
            catch (err) {
                console.log(err)
            }
        })
    }, [])

    const handleCellClick = () => {
        // setEventId(eventId)
        setIsEditing(true)
    }

    return (
        <form className={`cell-ctn ${label}`}
            onClick={() => handleCellClick()}
            ref={cellRef}
        >
            {isEditing
                ? <input
                    type={typeof value === 'number' ? 'number' : 'text'}
                    value={value}
                />
                : value
            }
        </form>
    )
}

export default Cell