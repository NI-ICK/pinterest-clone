import { usePinContext } from '../context/PinContext'
import { useNavigate, useParams, Link, useLocation } from 'react-router-dom'
import { useUserContext } from '../context/UserContext'
import { useEffect, useState, useRef } from 'react'
import { useFormDataContext } from '../context/FormDataContext'
import { LikeIcon } from '../assets/LikeIcon'
import { DeletePin } from '../components/DeletePin'
import { debounce } from 'lodash'
import { FormatDate } from '../utilities/FormatDate'
import { useCollectionContext } from '../context/CollectionContext'
import { CollectionsModal } from '../components/CollectionsModal'
import { CreateCollection } from '../components/CreateCollection'
import { ArrowDownIcon } from '../assets/ArrowDownIcon'
import { Pin } from '../components/Pin'
import { OptionsIcon } from '../assets/OptionsIcon'
import { EditPinModal } from '../components/EditPinModal'

export function PinPage() {
  const { id } = useParams()
  const { pins, fetchPin, pin, handleLikes, fetchPinComments, comments, fetchSimilarPins, similarPins, setPinModal, pinModal, setComments, handleDeleteCommentOrReply } = usePinContext()
  const { users, currUser, fetchUsers, fetchCurrUser, noUserImgUrl } = useUserContext()
  const { formData, handleCommentChange, handleCommentSubmit, formFilled, setFormData } = useFormDataContext()
  const { selectedCollection, setSelectedPinId, setShowColModal, handleCollectionAdd, handleCollectionRemove, fetchUserCollections, setSelectedCollection, collections } = useCollectionContext()
  const navigate = useNavigate()
  const modal = useRef()
  const replyInput = useRef()
  const [pinUser, setPinUser] = useState({})
  const [loading, setLoading] = useState(true)
  const [showReply, setShowReply] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [saved, setSaved] = useState(false)
  const [areCollectionsFetched, setAreCollectionsFetched] = useState(false)
  const [isCurrUserFetched, setIsCurrUserFetched] = useState(false)
  const [colLoading, setColLoading] = useState(false)
  const location = useLocation()
  const [ showEditPinModal, setShowEditPinModal ] = useState(false)

  const loadData = async () => {
    await fetchUsers()
    await fetchCurrUser()
    const pinFetched = await fetchPin(id)
    if(!pinFetched) return navigate('/404')
    await fetchPinComments(id)
    await fetchSimilarPins(id)
    setIsCurrUserFetched(true)
  }

  const loadCollectionData = async () => {
    if(currUser && isCurrUserFetched) {
      await fetchUserCollections(currUser._id)
      setAreCollectionsFetched(true)
    }
    if(!currUser && isCurrUserFetched) setLoading(false)
  }

  useEffect(() => {
    setLoading(true)
    loadData()
  }, [localStorage])

  useEffect(() => {
    if(location.pathname.startsWith('/pin/')) {
      setLoading(true)
      setAreCollectionsFetched(false)
      setIsCurrUserFetched(false)
      loadData()
    }
  }, [location])

  useEffect(() => {
    if(isCurrUserFetched) loadCollectionData()
  }, [isCurrUserFetched, currUser])

  useEffect(() => {
    if(areCollectionsFetched) {
      setSelectedCollection(collections[0])
      setLoading(false)
    }
  }, [areCollectionsFetched])

  useEffect(() => {
    if (!loading) {
      if(pin) {
        const foundUser = pin.user && users.find(user => user.username === pin.user.username)
        setPinUser(foundUser ? foundUser : { username: 'User Deleted' })
      }
    }
  }, [loading, pins, users])

  const formSubmit = async (e) => {
    setShowReply(false)
    e.preventDefault()
    await handleCommentSubmit()
    await fetchPinComments(id)
    const form = e.target
    form.reset()
  }

  useEffect(() => {
    if(showModal) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showModal])

  const handleClickOutside = (e) => {
    if (modal.current && !modal.current.contains(e.target)) {
      setShowModal(false)
    }
  }

  const handleLikeClick = debounce(async (commentId, likes) => {
    if(!currUser) return
    const isLiked = likes.includes(currUser._id)
  
    const updateCommentAndReplies = (comments) => {
      return comments.map(comment => ({
        ...comment,
        likes: comment._id === commentId
          ? (isLiked
              ? comment.likes.filter(userId => userId !== currUser._id)
              : [...comment.likes, currUser._id])
          : comment.likes,
        replies: comment.replies ? updateCommentAndReplies(comment.replies) : [],
      }))
    }
  
    setComments(prevComments => updateCommentAndReplies(prevComments))
  
    await handleLikes(commentId, isLiked ? 'decrement' : 'increment')
  }, 300)

  useEffect(() => {
    if (showReply && replyInput.current) {
      replyInput.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
      replyInput.current.focus()
    }
  }, [showReply])

  useEffect(() => {
    if(selectedCollection && !colLoading) setSaved(selectedCollection.pins && selectedCollection.pins.some(p => p._id === id))
    }, [selectedCollection])

  const handleBtnClick = async () => {
    setColLoading(true)
    if(saved) {
      setSaved(false)
      await handleCollectionRemove(selectedCollection._id, id)
    }
    if(!saved) {
      setSaved(true)
      await handleCollectionAdd(selectedCollection._id, id)
    }
    await fetchUserCollections(currUser._id)
    setColLoading(false)
  }

  if(!pin) return null

  return (
    <>
    <EditPinModal showEditPinModal={showEditPinModal} setShowEditPinModal={setShowEditPinModal} id={id}/>
    <CreateCollection />
    <DeletePin showModal={showModal} modal={modal} id={id} setShowModal={setShowModal}/>
    {!loading &&
    <>
      <div className="pinPageBackground" 
      onMouseEnter={() => setPinModal(true)}
      onMouseLeave={() => {
        setPinModal(false)
        setShowColModal(false)
        }}
        onTouchStart={() => setPinModal(true)}
        >
        <div className="pinContainer">
          <img draggable={false} src={pin.image} className='pinImg'/>
          <div className="pinDetails">
            {pinModal && <CollectionsModal />}
            <div className="detailsTop">
                {currUser && pinUser._id === currUser._id &&
                    <OptionsIcon onClick={() => { setShowEditPinModal(!showEditPinModal) }} tabIndex={0} onKeyDown={(e) => { if(e.key === 'Enter') e.target.click() }}/>}
              {currUser && <>
              <div tabIndex={0} className="collectionsBtn" onClick={() => {
                setSelectedPinId(id)
                setShowColModal(true)}}
                onKeyDown={(e) => { if(e.key === 'Enter') e.target.click() }}
                >
                <p>{selectedCollection.name}</p>
                <ArrowDownIcon color='black' />
              </div></>}
              {currUser && pinUser._id === currUser._id ? 
              <button className='greyBtn' onClick={() => setShowModal(!showModal)}>Delete</button> : null}
              {currUser &&
              <button 
                className={saved ? 'blackBtn' : 'redBtn'} 
                onClick={() => handleBtnClick()}>
                {saved ? "Saved" : "Save"}
              </button>}
            </div>
            <h2>{pin.title}</h2>
            <p>{pin.description}</p>
            <div className="pinUser"> 
              <img 
              draggable={false}
                src={pinUser.photo ? pinUser.photo : noUserImgUrl}
                onClick={() => pinUser.username !== 'User Deleted' ? navigate(`/${pinUser.username}`) : null}/>
              <Link to={pinUser.username !== 'User Deleted' ? `/${pinUser.username}` : null} >{pinUser.username}</Link>
            </div>
            <h3>Comments</h3>
            <div className="comments"> 
              {comments ? (comments.map((comment, index) => (
                <div className="comment" key={index} >
                  <div className="commentContent">
                    <img
                        draggable={false}
                      src={comment.user && comment.user.photo ? comment.user.photo : noUserImgUrl}
                      onClick={() => navigate(comment.user ? `/${comment.user.username}` : null)}/>
                    <div className="commentText">
                      <p><Link to={comment.user ? `/${comment.user.username}` : null}>{comment.user ? comment.user.username : 'User Deleted'}</Link>{comment.content}</p>
                      <div className="commentDetails">
                        <div className='date'><FormatDate postDate={comment.createdAt}/></div>
                        <p className="commentBtn" onClick={() => currUser ? setShowReply(index) : null} tabIndex={0} onKeyDown={(e) => { if(e.key === 'Enter') e.target.click() }}>Reply</p>
                        {currUser._id === comment.user._id && <p className="commentBtn" onClick={() => currUser ? handleDeleteCommentOrReply(comment._id, pin._id) : null} tabIndex={0} onKeyDown={(e) => { if(e.key === 'Enter') e.target.click() }}>Delete</p>}
                        <div 
                          onClick={() => currUser ? handleLikeClick(comment._id, comment.likes) : null}
                          tabIndex={0} onKeyDown={(e) => { if(e.key === 'Enter') e.target.click() }}
                          className={`likes ${currUser && comment.likes.includes(currUser._id) ? 'liked' : ''}`}>
                          <LikeIcon />
                          <p>{comment.likes.length}</p>
                        </div>
                    </div>
                    </div>
                  </div>
                  {showReply === index &&
                    <div className="addReplyContent">
                      <form onSubmit={formSubmit} className='fInput' id='replyForm'>
                        <input ref={replyInput} type='text' name='content' id='addReply' placeholder='Reply' value={formData.content} onChange={(e) => handleCommentChange(e, comment._id)} required/>
                      </form>
                      <div className="addReplyBtn">
                        <button className='greyBtn' onClick={() => {
                          setShowReply(false)
                          setFormData(prevFormData => ({ ...prevFormData, comment: { ...prevFormData.comment, content: null }}))
                          }}>Cancel</button>
                        <button className={formFilled ? 'redBtn' : 'btnOff'} type='submit' form='replyForm'>Save</button>
                      </div>
                    </div>}
                  {comment.replies.map((reply, index) => (
                    <div className="reply" key={index}>
                      <img
                      draggable={false}
                        src={reply.user && reply.user.photo ? reply.user.photo : noUserImgUrl}
                        onClick={() => navigate(`/${reply.user.username}`)}/>
                      <div className="replyText">
                        <p><Link to={reply.user && `/${reply.user.username}`}>{reply.user && reply.user.username}</Link>{reply.content}</p>
                        <div className="replyDetails">
                          <div className='date'><FormatDate postDate={reply.createdAt}/></div>
                          {currUser._id === comment.user._id && <p className="commentBtn" onClick={() => currUser ? handleDeleteCommentOrReply(reply._id, pin._id) : null} tabIndex={0} onKeyDown={(e) => { if(e.key === 'Enter') e.target.click() }}>Delete</p>}
                          <div 
                              onClick={() => handleLikeClick(reply._id, reply.likes)}
                              className={`likes ${currUser && reply.likes.includes(currUser._id) ? 'liked' : ''}`}>
                            <LikeIcon />
                            <p>{reply.likes.length}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ))) : (
                <p className='info'>No comments</p>
              )}
            </div>
            {currUser ? (
            <div className="addComment">
              <img draggable={false} src={currUser.photo ? currUser.photo : noUserImgUrl}/>
              <form className='fInput' onSubmit={formSubmit}>
                <input type="text" name="content" placeholder='Add a comment' value={formData.content} onChange={(e) => handleCommentChange(e, id)} required/>
              </form>
            </div>
            ) : (
              <p className='info'>Login to post comments</p>
            )}
          </div>
        </div>
      </div>
      {similarPins.length > 0 &&
      <div className="similarPins">
        <h1>More to explore</h1>
        <div className="pins">
            {similarPins.map((pin, index) => (
            <Pin
                key={pin._id}
                pin={pin}
                index={index + 1}
            />
            ))}
        </div>
      </div>
      }
      </>
}
    </>
  )
}