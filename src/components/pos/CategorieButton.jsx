import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useItems } from '../../hooks/useItems'
import { selectCategorie } from '../../stores/pos/posAction'


const CategorieButton = ({ name }) => {

    const selectedColor = { 'background': '#ecf2f9', 'text': '#2173d7', 'border': '#2173d7' }
    const defaultColor = { 'background': 'white', 'text': '#616161', 'border': 'white' }
    const selectedCategorie = useSelector(state => state.selectedCategorie.name)
    const dispatch = useDispatch()
    const setItems = useItems()

    const getColor = (selectedCategorie) => {
        if (selectedCategorie && selectedCategorie === name) {
            return selectedColor
        } else {
            return defaultColor
        }
    }


    const categorieStyle = {
        background: getColor(selectedCategorie).background,
        width: '100%',
        color: getColor(selectedCategorie).text,
        height: '70px',
        lineHeight: '1.4em',
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
            <button style={categorieStyle} onClick={() => setItems(name)}> {name}</button>
        </div>

    )
}

export default CategorieButton