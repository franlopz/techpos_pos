import React from 'react'
import CategorieButton from './CategorieButton'
import FooterPos from './FooterPos'
import NumericPad from './NumericPad'
import Order from './Order'
import ProductButton from './ProductButton'
import { useSelector } from 'react-redux'
import TicketHeader from './TicketHeader'

const PosContainerLarge = ({ categories }) => {

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

    return (
        <div className='flex flex-col h-full bg-gray-100'>
            <TicketHeader
                entities={ticket?.entities}
                ticketTags={ticket?.tags}
                calculations={ticket?.calculations}
            />
            <div className='flex flex-row overflow-y-auto h-full divide-x divide-solid'>
                <div className='overflow-y-auto w-1/4'>
                    <div className='grid grid-cols-1'>
                        {categories.map((name) => {
                            return <CategorieButton key={name} name={name} />
                        })}
                    </div>
                </div>
                <div className='flex flex-col w-3/4'>
                    <div className='overflow-y-auto h-3/5'>
                        <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'>
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
                    <div className='h-2/5 flex flex-row '>
                        <div className='w-3/5 overflow-y-auto border m-1 bg-white rounded-md relative'>
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
                        <div className='w-2/5'>
                            <NumericPad setPadQty={setPadQty} qtyHelper={padQty} />
                        </div>
                    </div>
                    <FooterPos />
                </div>
            </div>
        </div>
    )
}

export default PosContainerLarge