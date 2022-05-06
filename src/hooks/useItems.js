import { useDispatch } from 'react-redux'
import localForage from 'localforage'
import { selectCategorie } from '../stores/pos/posAction'

export const useItems = (categorie) => {

    const dispatch = useDispatch()

    const CategorieStore = localForage.createInstance({
        name: "POS",
        storeName: "Categories"
    })

    const setItems = (categorie) => {
        CategorieStore.getItem(categorie).then((value) => {
            dispatch(selectCategorie({
                name: categorie,
                items: value
            }))
        })
    }

    return setItems
}