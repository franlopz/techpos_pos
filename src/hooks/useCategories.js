import React from "react";
import localForage from 'localforage'
import { useDispatch, useSelector } from 'react-redux'
import { selectCategorie, setCategorieItems } from "../stores/pos/posAction";

const useCategories = () => {

    const [categories, setCategories] = React.useState([])
    const dispatch = useDispatch()

    React.useEffect(() => {

        const menuStore = localForage.createInstance({
            name: "POS",
            storeName: "Menus"
        })

        const posSettings = localForage.createInstance({
            name: "POS",
            storeName: "Settings"
        })

        const CategorieStore = localForage.createInstance({
            name: "POS",
            storeName: "Categories"
        })

        posSettings.getItem('savedSettings').then((settings) => {
            menuStore.getItem(settings.ScreenMenu).then((value) => {
                setCategories(value)
                return value[0]
            }).then((value) => {
                CategorieStore.getItem(value).then((items) => {
                    console.log(value)
                    dispatch(selectCategorie({
                        name: value,
                        items: items
                    }))
                });
            })
        })

    }, [])

    return [categories]

}

export default useCategories