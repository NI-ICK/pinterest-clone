import { CollectionsModal } from "./CollectionsModal"
import { ArrowDownIcon } from '../assets/ArrowDownIcon'
import { useCollectionContext } from "../context/CollectionContext"
import { useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import { useUserContext } from "../context/UserContext"
import { usePinContext } from "../context/PinContext"

export function Pin({ pin, index }) {
    const { setSelectedPinId, setShowColModal, handleCollectionAdd, fetchUserCollections, handleRemoveFromCollection, selectedCollection } = useCollectionContext()
    const { currUser } = useUserContext()
    const { adjustGridRows } = usePinContext()
    const [ btnClass, setBtnClass ] = useState('redBtn')
    const [ btnText, setBtnText ] = useState("Save")
    const navigate = useNavigate()
    const [ hoverIndex, setHoverIndex]  = useState(null)
    const [ loading, setLoading ] = useState(false)
    const [ loadedImg, setLoadedImg ] = useState(false)

    const handleBtnClick = async () => {
        setLoading(true)
        if (selectedCollection.pins.some(p => p._id === pin._id)) {
            setBtnClass('redBtn')
            setBtnText('Save')
            await handleRemoveFromCollection(selectedCollection._id, pin._id)
        }
        if (!selectedCollection.pins.some(p => p._id === pin._id)) {
            setBtnClass('blackBtn')
            setBtnText('Saved')
            await handleCollectionAdd(selectedCollection._id, pin._id)
        }
        await fetchUserCollections(currUser._id)
        setLoading(false)
    }

    useEffect(() => {
        if (!loading && selectedCollection) {
            setBtnClass(selectedCollection.pins && selectedCollection.pins.some(p => p._id === pin._id) ? 'blackBtn' : 'redBtn')
            setBtnText(selectedCollection.pins && selectedCollection.pins.some(p => p._id === pin._id) ? "Saved" : "Save")
        }
    }, [ selectedCollection ])

    const handleCollectionName = () => {
        return selectedCollection.name.length < 8 ? selectedCollection.name : selectedCollection.name.substring(0, 5) + '...'
    }

    const handlePinTitle = (title) => {
        if(!title) return 
        return title.length < 23 ? title : title.substring(0, 20) + '...'
    }

    return (
        <>
        <div
            className={`pin ${loadedImg ? 'loaded' : ''}`}
            tabIndex={0}
            onKeyDown={(e) => { if(e.key === 'Enter') e.target.click() }}
            onClick={() => navigate(`/pin/${pin._id}`)}
            onMouseEnter={() => setHoverIndex(index)}
            onMouseLeave={() => {
                setShowColModal(null)
                setHoverIndex(null)
            }}>
            {hoverIndex === index && selectedCollection && <CollectionsModal /> }
            <div className="pinContent">
                <div className={`pinBackground ${hoverIndex === index ? 'hover' : ''}`}>
                    <img
                        className={`pinImg ${hoverIndex === index ? 'hover' : ''}`}
                        src={ pin.image }
                        onLoad={(e) => { 
                            adjustGridRows(e)
                            setLoadedImg(true) 
                        }}
                        loading="lazy"
                        draggable={false}
                    />
                </div>
                <p className="pinTitle">{ handlePinTitle(pin.title) }</p>
                {hoverIndex === index && selectedCollection && currUser &&
                    <div className="hoverOptions" onClick={(e) => e.stopPropagation()}>
                        <div className="collectionsBtn"
                            onClick={() => {
                                setSelectedPinId(pin._id)
                                setShowColModal(index)
                            }}>
                            <p>{handleCollectionName()}</p>
                            <ArrowDownIcon color='white' />
                        </div>
                        <button
                            className={ btnClass }
                            onClick={() => handleBtnClick()}>
                            { btnText }
                        </button>
                    </div>}
            </div>
        </div>
        </>
    )
}