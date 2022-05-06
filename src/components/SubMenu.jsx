import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import DropdownMenu from './DropdownMenu';
import Divider from './Divider';

const SubMenu = ({ item, index }) => {

    const [subnav, setSubnav] = useState(false)
    const showSubnav = () => setSubnav(!subnav)

    return (
        <> 
            {index === 0  ? null : <Divider color='DimGray' opacity='0.2'/>}
            <div className='px-2 py-1'>
            <Link to={item.path} onClick={item.subNav && showSubnav} className='relative flex justify-start items-center p-5 list-none h-8 text-base hover:bg-indigo-600 border-l-4 border-transparent hover: rounded-lg'>
                <div className='text-gray-400 mr-2'>
                    {item.icon}
                </div>
                <span className='ml-2'>
                    {item.title}
                </span>
                <span className='absolute right-8'>
                    {item.subNav && subnav
                        ? item.iconOpened
                        : item.subNav
                            ? item.iconClosed
                            : null}
                </span>
            </Link>
            {subnav && item.subNav.map((item, index) => {
                return <DropdownMenu item={item} key={index} />
            })}
            </div>
        </>
    )
}

export default SubMenu;