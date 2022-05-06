import React from 'react';
import { Link } from 'react-router-dom';

const DropdownMenu = ({ item }) => {

    return (
        <>
            <Link to={item.path} className='flex justify-start items-center p-5 list-none h-6 text-base hover:bg-indigo-600 border-l-4 border-transparent rounded-lg'>
                <div className='ml-8'>
                    {item.title}
                </div>
            </Link>
        </>
    )
}

export default DropdownMenu;