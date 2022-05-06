import React from 'react'

const OrderTag = ({ tag, selectedTag, selectTag, groupTagName, groupTagCount, countLimits, canAdd }) => {
    const selectedColor = { 'background': '#dd3c32', 'text': '#ffffff' }
    const defaultColor = { 'background': '#eeeeee', 'text': '#353636' }

    const getColor = (selectedTag) => {
        if (selectedTag && selectedTag.quantity > 0) {
            return selectedColor
        } else {
            return defaultColor
        }
    }

    React.useEffect(() => {
        const checkLimit = () => {
            let tagSelectedQty = groupTagCount?.quantity !== undefined ? groupTagCount?.quantity : 0;
            let tagMinQty = countLimits?.min !== undefined ? countLimits?.min : 0;
            if (tagSelectedQty < tagMinQty) { canAdd(false) }
            if (tagMinQty !== 0 && tagSelectedQty === tagMinQty) canAdd(true)
        }
        checkLimit()
    }, [selectedTag, canAdd, countLimits, groupTagCount])



    const tagStyle = {
        background: getColor(selectedTag).background,
        width: '100%',
        color: getColor(selectedTag).text,
        height: '100%',
        lineHeight: '1.4em',
        border: '1px solid  #ccc',
        borderRadius: '8px',
        wordWrap: 'break-word',
        minHeight: '45px',
        padding: '1px 1px 1px 1px',
        fontSize: '0.8em'
    }

    const toSelectTag = () => {

        if ((countLimits?.max <= groupTagCount?.quantity) && countLimits?.max !== 0) {
            return selectTag({ tagName: groupTagName, tag: tag.name }, 'remove')
        }

        let qty = selectedTag?.quantity !== undefined ? selectedTag.quantity : 0;
        if (qty === parseInt(tag.maxQuantity)) {
            selectTag({ tagName: groupTagName, tag: tag.name }, 'remove')
        } else {
            selectTag({ tagName: groupTagName, tag: tag.name, price: tag.price, quantity: qty + 1, rate: tag.rate })
        }
    }

    return (
        <div className='flex-1 rounded-md font-extrabold text-center p-1'>
            <button style={tagStyle} onClick={() => { toSelectTag() }}>
                <span>
                    {selectedTag?.quantity === undefined ? tag.name : selectedTag?.quantity + ' x ' + tag.name}
                </span>
                <br></br>
                <span>
                    {tag.rate !== 0 ? tag.rate + '%' : tag.price}
                </span>
            </button>
        </div>

    )
}

export default OrderTag