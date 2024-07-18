import { usePinContext } from '../context/PinContext'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { useUserContext } from '../context/UserContext'
import { useEffect, useState, useRef } from 'react'
import { useFormDataContext } from '../context/FormDataContext'
import { LikeIcon } from '../assets/LikeIcon'
import { DeletePin } from '../components/DeletePin'
import { debounce } from 'lodash'
import { FormatDate } from '../components/FormatDate'

export function Pin() {
  const { id } = useParams()
  const { pins, fetchPin, pin, handleLikes, fetchPinComments } = usePinContext()
  const { users, currUser, fetchUsers } = useUserContext()
  const { formData, handleCommentChange, handleCommentSubmit, formFilled, setFormData } = useFormDataContext()
  const navigate = useNavigate()
  const modal = useRef()
  const replyInput = useRef()
  const [pinUser, setPinUser] = useState({})
  const [loading, setLoading] = useState(true)
  const [saved, setSaved] = useState(false)
  const [showReply, setShowReply] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [comments, setComments] = useState([])
  
  const loadData = async () => {
    await fetchUsers()
    await fetchPin(id)
    const fetchedComments = await fetchPinComments(id)
    setComments(fetchedComments)
    setLoading(false)
  }

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    if (!loading) {
      if(pin) setPinUser(pin.user ? users.find(user => user.username === pin.user.username) : { username: 'User Deleted' })
      if(!pin) navigate('/404')
    }
  }, [loading, pins, users])

  const formSubmit = async (e) => {
    e.preventDefault()
    await handleCommentSubmit()
    const updatedComments = await fetchPinComments(id)
    setComments(updatedComments)
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

  if(!pin) return null

  return (
    <>
    <DeletePin showModal={showModal} modal={modal} id={id} setShowModal={setShowModal}/>
    {!loading ? (
      <div className="pinBackground">
        <div className="pinContainer">
          <img src={`https://localhost:5000/public/pins/${pin.image}`} alt={pin.title} className='pinImg'/>
          <div className="pinDetails">
            <div className="detailsTop">
              <div className="showBoard">Board</div>
              {pinUser.username === currUser.username ? 
              <button className='greyBtn' onClick={() => setShowModal(!showModal)}>Delete</button> : null}
              <button className={saved ? 'blackBtn' : 'redBtn'}>{saved ? "Saved" : "Save"}</button>
            </div>
            <h2>{pin.title}</h2>
            <p>{pin.description}</p>
            <div className="pinUser"> 
              <img 
                src={pinUser.photo ? `https://localhost:5000/public/photos/${pinUser.photo}` : `https://localhost:5000/public/photos/noPhoto.jpg`}
                onClick={() => pinUser.username !== 'User Deleted' ? navigate(`/${pinUser.username}`) : null}/>
              <Link to={pinUser.username !== 'User Deleted' ? `/${pinUser.username}` : null} >{pinUser.username}</Link>
            </div>
            <h3>Comments</h3>
            <div className="comments">
              {comments ? (comments.map((comment, index) => (
                <div className="comment" key={index} >
                  <div className="commentContent">
                    <img
                      src={comment.user && comment.user.photo ? `https://localhost:5000/public/photos/${comment.user.photo}` : `https://localhost:5000/public/photos/noPhoto.jpg`}
                      onClick={() => navigate(comment.user ? `/${comment.user.username}` : null)}/>
                    <div className="commentText">
                      <p><Link to={comment.user ? `/${comment.user.username}` : null}>{comment.user ? comment.user.username : 'User Deleted'}</Link>{comment.content}</p>
                      <div className="commentDetails">
                        <div className='date'><FormatDate postDate={comment.createdAt}/></div>
                        <p className="replyBtn" onClick={() => setShowReply(index)}>Reply</p>
                        <div 
                          onClick={() => handleLikeClick(comment._id, comment.likes)}
                          className={`likes ${comment.likes.includes(currUser._id) ? 'liked' : ''}`}>
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
                        src={reply.user.photo ? `https://localhost:5000/public/photos/${reply.user.photo}` : `https://localhost:5000/public/photos/noPhoto.jpg`}
                        onClick={() => navigate(`/${reply.user.username}`)}/>
                      <div className="replyText">
                        <p><Link to={`/${reply.user.username}`}>{reply.user.username}</Link>{reply.content}</p>
                        <div className="replyDetails">
                          <div className='date'><FormatDate postDate={reply.createdAt}/></div>
                          <div 
                              onClick={() => handleLikeClick(reply._id, reply.likes)}
                              className={`likes ${reply.likes.includes(currUser._id) ? 'liked' : ''}`}>
                            <LikeIcon />
                            <p>{reply.likes.length}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ))) : (
                <p>No comments</p>
              )}
            </div>
            {currUser ? (
            <div className="addComment">
              <img src={currUser.photo ? `https://localhost:5000/public/photos/${currUser.photo}` : `https://localhost:5000/public/photos/noPhoto.jpg`}/>
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
  ) : ( null )}
  </>
  )
}