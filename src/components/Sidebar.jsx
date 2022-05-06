import React, { useState } from 'react';
import "../styles/output.css";
import { Link } from 'react-router-dom';
import * as RiIcons from "react-icons/ri";
import SidebarData from './SidebarData'
import SubMenu from './SubMenu'
import { useLocation } from 'react-router-dom'


const Sidebar = () => {

    const [sidebar, setSidebar] = useState(false)
    const showSidebar = () => setSidebar(!sidebar)
    const [isShowDialog, setIsShowDialog] = useState(false);
    let path = useLocation().pathname;


    const handleCloseDialog = () => {
        setIsShowDialog(!isShowDialog)
    }

    return (
        <>
            <div className='w-full bg-gray-900 h-12 flex justify-start items-center ' >
                <Link to='#'>
                    <RiIcons.RiMenuLine onClick={showSidebar} className='ml-4 text-3xl h-8 flex justify-start items-center text-gray-300' />
                </Link>
                {path === '/productos/menus' && (
                    <div>
                        <RiIcons.RiSettings4Fill onClick={handleCloseDialog} className='ml-4 text-3xl h-8 flex justify-start items-center text-gray-300 absolute top-2 right-2' />
                    </div>
                )}
            </div>
            <nav className={` transition-all z-10 bg-gray-900 w-60 h-full  flex fixed top-0 ${sidebar ? 'left-0' : '-left-full'}  overflow-y-auto`}>
                <div className='w-full text-gray-300'>
                    <Link to='#' className='text-gray-400'>
                        <RiIcons.RiArrowLeftCircleFill onClick={showSidebar} className='absolute text-3xl h-8 mt-2 mb-2 right-2' />
                    </Link>
                    <div className='mt-12'>
                        {SidebarData.map((item, index) => {
                            return <SubMenu item={item} key={index} index={index} />;
                        })}
                    </div>
                </div>
            </nav>
        </>

    )
}
export const MSidebar = React.memo(Sidebar);

export default Sidebar;