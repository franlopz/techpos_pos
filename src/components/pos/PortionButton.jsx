import React from 'react'

const PortionButton = ({ portion, selectedPortion = '' ,selectPortion, portionIndex}) => {

    const selectedColor = { 'background': '#dd3c32', 'text': '#ffffff' }
    const defaultColor = { 'background': '#eeeeee', 'text': '#353636' }

    const getColor = (selectedPortion) => {
        if (selectedPortion && selectedPortion.name === portion.name) {
            return selectedColor
        } else {
            return defaultColor
        }
    }

    React.useEffect(()=>{
        if(portionIndex=== 0 && !selectedPortion ) selectPortion(portion)
    },[portionIndex,selectedPortion,portion,selectPortion])

    const portionStyle = {
        background: getColor(selectedPortion).background,
        width: '100%',
        color: getColor(selectedPortion).text,
        height: '100%',
        lineHeight: '1.4em',
        border: '1px solid  #ccc',
        borderRadius: '8px',
        wordWrap: 'break-word',
        minHeight: '45px',
        padding: '1px 1px 1px 1px',
        fontSize: '1em'
    }
    
    return (
        <button style={portionStyle} onClick={() => { selectPortion(portion) }}>
            <span>
                {portion.name}
            </span>
            <br></br>
            <span>
                {portion.price}
            </span>
        </button>
    )
}

export default PortionButton