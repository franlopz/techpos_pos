import React from 'react'
import './fail.css'

const Fail = () => {

    return (
        <div className='backfail'>
            <div className='failcontainer'>
                <svg className="fail" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50" strokeWidth="5" overflow='visible'>
                    <circle strokeWidth='5' className="fail__circle" cx="25" cy="25" r="25" fill="none" />
                    <path className='fail__check' d="M 15,15 l 20,20 M 35,15 l -20,20" stroke="red" strokeWidth="5" />
                </svg>
            </div>
        </div>

    )

}

export default Fail