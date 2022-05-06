import React from 'react'

const TicketActionButton = ({ categorie, getItemsFromCategorie, selectedCategorie }) => {

    const selectedColor = { 'background': '#ecf2f9', 'text': '#2173d7', 'border': '#2173d7' }
    const defaultColor = { 'background': 'white', 'text': '#616161', 'border': 'white' }

    const getColor = (selectedCategorie) => {
        if (selectedCategorie && selectedCategorie === categorie) {
            return selectedColor
        } else {
            return defaultColor
        }
    }
    const categorieStyle = {
        // background: '#2196f3',
        background: getColor(selectedCategorie).background,
        width: '100%',
        color: getColor(selectedCategorie).text,
        // color: 'white',
        height: '70px',
        lineHeight: '1.4em',
        // border: '1px solid  #ccc',
        borderRadius: '8px',
        wordWrap: 'break-word',
        minHeight: '45px',
        padding: '1px 1px 1px 1px',
        fontSize: '1em',
        borderColor: getColor(selectedCategorie).border,
        boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px',
        borderWidth: '1px 1px 1px 1px'

    }
    return (
        <div style={{ margin: '5px 5px 5px 5px' }}>
            <button style={categorieStyle} onClick={() => { getItemsFromCategorie(categorie) }}> {categorie}</button>
        </div>

    )
}

export default TicketActionButton