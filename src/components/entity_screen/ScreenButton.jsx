import React from 'react'

const ScreenButton = ({ screen, onClickScreen }) => {

    const screenButtonStyle = {
        width: '100%',
        height: '70px',
        lineHeight: '1.4em',
        borderRadius: '1px',
        wordWrap: 'break-word',
        minHeight: '45px',
        fontSize: '1em',
        boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px',
        // borderWidth: '3px 3px 3px 3px'
    }

    return (
            <button style={screenButtonStyle} onClick={() => onClickScreen(screen)}>{screen}</button>
    )
}

export default ScreenButton