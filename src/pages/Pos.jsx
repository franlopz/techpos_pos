import React from 'react'
import { gqlQuery } from '../functions/gqlSambaMethods'
import { addOrderToTerminalTicket, changeEntity, closeTerminalTicket, createTerminalTicket, loadTerminalTicket, refreshTicket, updateOrder } from '../functions/gqlSambaQueries'
import { MSidebar } from '../components/Sidebar'
import Dialog from '../components/Dialog'
import AddProduct from '../components/pos/AddProduct'
import { useViewport } from '../context/ViewportContext'
import round from '../functions/round'
import Spinner from '../components/spinner/Spinner'
import Success from '../components/success_message/Success'
import Fail from '../components/fail_message/Fail'
import '../styles/styles.css'

import { useDispatch, useSelector } from 'react-redux'
import { addOrder, closeOrder } from '../stores/pos/posAction'
// import PosContainerSmall from '../components/pos/PosContainerSmall'
import PosContainerLarge from '../components/pos/PosContainerLarge'
import useCategories from '../hooks/useCategories'
import PosContainerSmall from '../components/pos/PosContainerSmall'




const Pos = () => {

    const dispatch = useDispatch()
    const selectedItem = useSelector(state => state.newOrder)
    const [categories] = useCategories()
    const [loader, setLoader] = React.useState(false)
    const [success, setSuccess] = React.useState(false)
    const [fail, setFail] = React.useState(false)
    const { width, height } = useViewport()



    const handleCloseDialog = () => {
        // setIsShowDialog(!isShowDialog)
        dispatch(closeOrder())
    }

    React.useEffect(() => {
        if (success === true) {
            const successMsg = setTimeout(() => {
                setSuccess(false)
            }, 2000);
            return () => clearTimeout(successMsg);
        }
    }, [success])

    React.useEffect(() => {
        if (fail === true) {
            const failMsg = setTimeout(() => {
                setFail(false)
            }, 2000);
            return () => clearTimeout(failMsg);
        }
    }, [fail])


    return (
        <>
            {selectedItem && (
                <Dialog
                    title={selectedItem.name}
                    handleCloseDialog={handleCloseDialog}
                    size={`w-full max-h-96`}>
                    {/* size={`w-full ${height > 750 ? 'h-full' : 'max-h-96'}`}> */}
                    <AddProduct selectedItem={selectedItem} />
                </Dialog>
            )}
            <div style={{ height: height, display: 'flex', flexDirection: 'column' }}>
                {loader ? <Spinner /> : null}
                {success ? <Success /> : null}
                {fail ? <Fail /> : null}
                {width >= 807 ?
                    <PosContainerLarge categories={categories} />
                    :
                    <PosContainerSmall categories={categories} />
                }
            </div>
        </>
    )
}

export default Pos
