import { useNavigate, useLocation } from "react-router-dom"
import { usePinContext } from "../context/PinContext"
import { useState, useEffect } from "react"

export function Home() {
  const { pins, setPin } = usePinContext()
  const navigate = useNavigate()
  const [hoverIndex, setHoverIndex] = useState(null)
  const location = useLocation()

  useEffect(() => {
    if(location.pathname === '/') setPin(null)
  }, [location])

  return (
    <>
      {pins ? (
        <div className="pins" >
        {pins.map((pin, index) => (
          <div 
            key={index} 
            className="pin" 
            onClick={() => navigate(`/pin/${pin._id}`)}
            onMouseEnter={() => setHoverIndex(index)}
            onMouseLeave={() => setHoverIndex(null)}
            >
            <div className="pinContent">
              <img 
                className={hoverIndex === index ? 'hover' : ''}
                src={`https://localhost:5000/public/pins/${pin.image}`} 
                alt={pin.title} 
                loading="lazy"
                />
              <p className="pinTitle">{pin.title}</p>
              {hoverIndex === index && <button className="redBtn saveBtn">Save</button>}
            </div>
          </div>
        ))}
        </div>
      ) : (
        <p>No Pins</p>
      )}
    </>
  )
}