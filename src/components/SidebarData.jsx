import React from 'react';
import * as RiIcons from "react-icons/ri";

const SidebarData = [
    {
        title: 'POS',
        path: '/',
        icon: <RiIcons.RiStore3Fill />,
        iconClosed: <RiIcons.RiArrowDownSLine />,
        iconOpened: <RiIcons.RiArrowUpSLine />,
        subNav: null
    },
    {
        title: 'Settings',
        path: '/settings',
        icon: <RiIcons.RiSettings2Fill />,
        iconClosed: <RiIcons.RiArrowDownSLine />,
        iconOpened: <RiIcons.RiArrowUpSLine />,
        subNav: null
    }
]

export default SidebarData;