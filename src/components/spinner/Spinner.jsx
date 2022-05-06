import React from "react";
import './spinner.css';

function Spinner({ porcentage }) {
    return (
        <>
            <div className='backspinner'>
                <div className='spinnercontainer'>
                    <svg className="spinner" viewBox="0 0 50 50">
                        <circle
                            className="path"
                            cx="25"
                            cy="25"
                            r="20"
                            fill="none"
                            strokeWidth="5"
                        ></circle>
                    </svg>
                    {porcentage ?
                        <p className='porcentage'>
                            {parseInt(porcentage)}%
                        </p>
                        : null}

                </div>
            </div>
        </>
    );
}

export default Spinner;