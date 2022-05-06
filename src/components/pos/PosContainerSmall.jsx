import React from 'react'
import { useSelector } from 'react-redux'
import { useViewport } from '../../context/ViewportContext'
import CategorieButton from './CategorieButton'
import FooterPos from './FooterPos'
import NumericPad from './NumericPad'
import Order from './Order'
import ProductButton from './ProductButton'
import TicketHeader from './TicketHeader'

const PosContainerSmall = ({ categories }) => {

    const [scrollToBottom, setScrollToBottom] = React.useState(Date.now())
    const divRref = React.useRef(null);
    const ticket = useSelector(state => state.ticket)
    const items = useSelector(state => state.selectedCategorie.items)
    const [padQty, setPadQty] = React.useState(1)

    React.useEffect(() => {
        if (divRref.current) {
            divRref.current.scrollIntoView(
                {
                    behavior: 'smooth',
                    block: 'end',
                    inline: 'nearest'
                })
        }
    },
        [ticket])
    var elem = document.documentElement;

    function openFullscreen() {
        window.scrollTo(0, 1000)
        if (elem.requestFullscreen) {
            elem.requestFullscreen();
        } else if (elem.webkitRequestFullscreen) { /* Safari */
            elem.webkitRequestFullscreen();
        } else if (elem.msRequestFullscreen) { /* IE11 */
            elem.msRequestFullscreen();
        }
    }
    return (
        <div className='flex flex-col overflow-y-auto h-full bg-gray-100'>
            <TicketHeader
                entities={ticket?.entities}
                ticketTags={ticket?.tags}
                calculations={ticket?.calculations}
            />
            <div className='flex flex-row mx-px overflow-y-auto h-3/5 divide-x divide-solid'>
                <div className='overflow-y-auto w-1/3'>
                    <div className='grid grid-cols-1 md:grid-cols-2'>
                        {categories.map((name) => {
                            return <CategorieButton key={name} name={name} />
                        })}
                    </div>
                </div>
                <div className='flex flex-col w-2/3'>
                    <NumericPad setPadQty={setPadQty} qtyHelper={padQty} />
                    <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 overflow-y-auto'>
                        {items?.map((item) => {
                            return <ProductButton
                                key={item.id}
                                productName={item.name}
                                productId={item.id}
                                qtyHelper={padQty}
                                setPadQty={setPadQty} />
                        })}
                    </div>
                </div>
            </div>
            <div className='h-2/5 overflow-y-auto border mx-1 bg-white rounded-md relative'>
                {ticket?.orders.map((order, index) => {
                    return <Order
                        key={order.uniqueId + order.uid}
                        index={index}
                        order={order}
                        padQty={padQty}
                    />
                })}
                <div ref={divRref} />
            </div>
            <FooterPos />
        </div>
    )
}

export default PosContainerSmall