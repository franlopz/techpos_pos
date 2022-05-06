import React from 'react'

const EntityButton = ({ entity, onEntityClick }) => {

    const entityButtonStyle = {
        background: entity.color,
        // background: getColor(selectedCategorie).background,
        width: '100%',
        // color: getColor(selectedCategorie).text,
        color: entity.labelColor,
        height: '100%',
        lineHeight: '1.4em',
        // border: '1px solid  #ccc',
        borderRadius: '1px',
        wordWrap: 'break-word',
        minHeight: '70px',
        // margin: '3px',
        // padding: '1px 1px 1px 1px',
        fontSize: '1em',
        borderColor: entity.color,
        boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px',
        borderWidth: '3px 3px 3px 3px'

    }

    return (

        <div>
            <button
                style={entityButtonStyle}
                onClick={() => onEntityClick({ type: entity.type, name: entity.name })}>
                {entity.name}
            </button>
        </div>
    )
}

export default EntityButton