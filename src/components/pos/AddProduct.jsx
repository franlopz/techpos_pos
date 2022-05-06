import React from 'react'
import localForage from 'localforage'
import PortionButton from './PortionButton'
import GroupTag from './GroupTag'
import OrderTag from './OrderTag'
import round from '../../functions/round'
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux'
import { closeOrder, setTicket } from '../../stores/pos/posAction'

const errorToast = (msg) => toast.error(msg, { id: 'error', duration: 1500 });

const AddProduct = ({ selectedItem }) => {

    const { id, savedSelectedPortion, savedOrderTags, savedGroupTagCount, arrayIndex, quantity = 1 } = selectedItem
    const dispatch = useDispatch()
    const orders = useSelector(state => state.ticket.orders)
    const ticket = useSelector(state => state.ticket)
    const [product, setProduct] = React.useState(null)
    const [selectedPortion, setSelectedPortion] = React.useState(savedSelectedPortion)
    const [ordertags, setOrdertags] = React.useState(savedOrderTags)
    const [groupTagCount, setGroupTagCount] = React.useState(savedGroupTagCount)
    const [canClose, setCanClose] = React.useState(true)
    const [customTag, setCustomTag] = React.useState({ tag: '', price: '' })


    React.useEffect(() => {
        const productsStore = localForage.createInstance({
            name: "POS",
            storeName: "Products"
        })

        productsStore.getItem(id.toString()).then((value) => {
            setProduct(value);
        })

    }, [id])



    const selectPortion = (portion) => {
        setSelectedPortion(portion);
        setOrdertags({})
        setGroupTagCount({})
    }

    const selectTag = (tagFn, action) => {
        if (action === 'remove') {
            //to remove order tags
            let temp = { ...ordertags }

            let tagName2 = tagFn.tagName
            let oldTags = { ...temp[tagName2] }
            delete oldTags[tagFn.tag]
            let x = { ...oldTags }
            temp[tagFn.tagName] = x

            let res = Object.values(oldTags)
                .reduce((acc, curr) => acc = acc + curr["quantity"], 0)
            setOrdertags(temp)

            //to remove group tag count
            let previousGroupTagCount = { ...groupTagCount }
            previousGroupTagCount[tagName2] = { quantity: res }
            setGroupTagCount(previousGroupTagCount)

        } else {
            //to count order tags
            let temp = { ...ordertags }
            let tagName = tagFn.tagName
            let oldTags = temp[tagName]
            let tagToAdd = {}
            tagToAdd[tagFn.tag] = {
                quantity: tagFn.quantity,
                price: tagFn.price,
                rate: tagFn.rate
            }
            let x = { ...oldTags, ...tagToAdd }
            temp[tagFn.tagName] = x

            //to count group order tags

            let res = Object.values(x)
                .reduce((acc, curr) => acc = acc + curr["quantity"], 0)

            let tempgroupTagCount = {}
            tempgroupTagCount[tagName] = { quantity: res }

            let previousGroupTagCount = { ...groupTagCount }
            previousGroupTagCount[tagName] = { quantity: res }

            setGroupTagCount(previousGroupTagCount)
            setOrdertags(temp)
        }
    }

    const canAdd = (response) => {
        setCanClose(response)
    }

    const handleSubmit = (e) => {
        e.preventDefault();
    }

    const handleChange = (e) => {
        setCustomTag(
            {
                ...customTag,
                [e.target.name]: e.target.value
            }
        )
    }
    const test = () => {
        let order = {}
        let portionPrice = selectedPortion?.price
        let tagsPrice = 0
        let tags = []
        if (ordertags) {

            let ordertagsobject = Object.values(ordertags)
            let orderTagKeys = Object.keys(ordertags)

            for (let groupTag of orderTagKeys) {
                let tagsList = Object.keys(ordertags[groupTag])
                for (let tagObject of tagsList) {
                    let temTag = {
                        tagName: groupTag,
                        tag: tagObject,
                        quantity: ordertags[groupTag][tagObject]['quantity'],
                        price: ordertags[groupTag][tagObject]['price'],
                        rate: ordertags[groupTag][tagObject]['rate'],
                    }
                    tags.push(temTag)
                }
            }
            for (let order of ordertagsobject) {
                console.log(order)
                let res = Object.values(order)
                    // .reduce((acc, curr) => acc = acc + curr["price"] * curr["quantity"], 0)
                    .reduce((acc, curr) => {
                        if (curr["rate"] > 0) return acc
                        return acc + curr["price"] * curr["quantity"]
                    }, 0)
                tagsPrice = parseFloat(res) + parseFloat(tagsPrice)
            }
        }



        let totalPrice = round(portionPrice, 2)

        order = {
            uid: Math.random().toString(16).slice(2),
            productId: id,
            name: product.name,
            quantity: quantity,
            portion: selectedPortion?.name,
            price: totalPrice,
            tags: tags,
            states: [{ state: "New Order", stateName: "Status", stateValue: "" }],
            product: {
                id: id,
                name: product.name,
                total: totalPrice,
                quantity: quantity
            },
            selectedPortion: selectedPortion,
            selectedOrderTags: ordertags,
            groupTagCount: groupTagCount
        }

        if (arrayIndex !== null) {

            let ordersList = [...orders]
            ordersList[arrayIndex] = order
            let modifiedTicket = { ...ticket }
            modifiedTicket['orders'] = ordersList
            dispatch(setTicket(modifiedTicket))
            dispatch(closeOrder())

        } else {
            // let temp = [...ordersToSubmit, ...value, ...jsonTicket.data.ticket.orders]
            let ordersList = [...orders]
            ordersList.push(order)
            let modifiedTicket = { ...ticket }
            modifiedTicket['orders'] = ordersList
            dispatch(setTicket(modifiedTicket))
            // setOrdersToSubmit(modifiedTicket)
            // setScrollToBottom(Date.now()) 
            dispatch(closeOrder())
            // setPadQty(1)

        }

    }

    const addCustomTag = () => {
        if (customTag.tag !== '') {
            let groupTags = [...selectedPortion.tags]
            let newSelectedPortion = { ...selectedPortion }
            let index = 0
            for (let groupTag of groupTags) {
                if (groupTag.name === 'Notas') {
                    let newGroupTag = { ...groupTag }

                    let newTags = [...groupTag.tags]

                    let tagCount = newTags.filter(e => e.name === customTag.tag).length

                    if (tagCount === 0) {
                        let newTag = {
                            color: null,
                            description: null,
                            filter: null,
                            header: null,
                            id: null,
                            maxQuantity: "1",
                            name: customTag.tag,
                            price: round(customTag.price, 2),
                            rate: 0,
                        }

                        newTags.push(newTag)
                        newGroupTag['tags'] = newTags
                        newSelectedPortion['tags'][index] = newGroupTag
                        setSelectedPortion(newSelectedPortion)
                        let temp = { ...ordertags }

                        let tagName = 'Notas'
                        let oldTags = temp[tagName]
                        let tagToAdd = {}
                        tagToAdd[customTag.tag] = {
                            quantity: 1,
                            price: parseFloat(round(customTag.price, 2))
                        }
                        let x = { ...oldTags, ...tagToAdd }
                        temp['Notas'] = x

                        //to count group order tags

                        let res = Object.values(x)
                            .reduce((acc, curr) => acc = acc + curr["quantity"], 0)

                        let tempgroupTagCount = {}
                        tempgroupTagCount[tagName] = { quantity: res }

                        let previousGroupTagCount = { ...groupTagCount }
                        previousGroupTagCount[tagName] = { quantity: res }
                        console.log(temp)

                        setGroupTagCount(previousGroupTagCount)
                        setOrdertags(temp)
                        setCustomTag({ tag: '', price: '' })
                    }

                }
                index++
            }
        }
    }

    return (
        <div >
            {product && (
                <div className='rounded-md border-2 mt-2 border-gray-300'>
                    <p className='z-10 -top-3 ml-2 px-2 bg-white max-w-min text-sm text-gray-500 relative'>Porciones</p>
                    <div className='grid grid-cols-3'>
                        {product.portions.map((portion, index) => {
                            return <div className='flex-1 text-xs rounded-md font-extrabold text-center p-1' key={portion.name}>
                                <PortionButton selectedPortion={selectedPortion} portion={portion} selectPortion={selectPortion} portionIndex={index} />
                            </div>
                        })}
                    </div>
                </div>
            )}
            {selectedPortion && (
                selectedPortion.tags.map((groupTag) => {
                    let max = groupTag['max']
                    let min = groupTag['min']
                    let groupTagName = groupTag.name;
                    return <GroupTag key={groupTag.name} groupTag={groupTag} countLimits={{ max: max, min: min }} groupTagCount={groupTagCount[groupTagName]} >
                        {groupTag.name === 'Notas' ?
                            <div>
                                <div >
                                    <form className='flex gap-px text-sm mx-1' autoComplete="off" onSubmit={handleSubmit}>
                                        <div className='inputgroup'>
                                            <input className='inputfield' placeholder=" " type="text" name="tag" value={customTag.tag} onChange={handleChange} />
                                            <label className='inputlabel'>Tag</label>
                                        </div>
                                        <div className='inputgroup'>
                                            <input className='inputfield' placeholder=" " type="number" step="0.01" min="0" name="price" value={customTag.price} onChange={handleChange} />
                                            <label className='inputlabel'>Precio</label>
                                        </div>
                                        <input className='button mt-1.5' type="submit" value="+" onClick={() => addCustomTag()} />
                                    </form>
                                </div>
                                <div className='grid grid-cols-3'>
                                    {groupTag.tags.map((tag) => {
                                        let tagName = tag.name;
                                        return <OrderTag key={tag.name}
                                            tag={tag}
                                            selectedTag={ordertags?.[groupTagName]?.[tagName]}
                                            selectTag={selectTag}
                                            groupTagName={groupTagName}
                                            countLimits={{ max: max, min: min }}
                                            groupTagCount={groupTagCount[groupTagName]}
                                            canAdd={canAdd} />
                                    })}
                                </div>
                            </div>
                            :
                            groupTag.tags.map((tag) => {
                                let tagName = tag.name;
                                return <OrderTag key={tag.name}
                                    tag={tag}
                                    selectedTag={ordertags?.[groupTagName]?.[tagName]}
                                    selectTag={selectTag}
                                    groupTagName={groupTagName}
                                    countLimits={{ max: max, min: min }}
                                    groupTagCount={groupTagCount[groupTagName]}
                                    canAdd={canAdd} />
                            })}
                    </GroupTag>
                }))
            }
            <button className='button' onClick={() => {
                // if (savedSelectedPortion)
                canClose ? test() : errorToast('Hay elecciones obligatorias')
            }}>{savedSelectedPortion ? 'Actualizar' : 'Agregar'}</button>
        </div>
    )
}

export default AddProduct