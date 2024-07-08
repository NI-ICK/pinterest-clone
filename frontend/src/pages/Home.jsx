import { useNavigate } from "react-router-dom"
import { usePinContext } from "../context/PinContext"

export function Home() {
  const { pins } = usePinContext()
  const navigate = useNavigate()

  return (
    <>
      {pins ? (
        <div className="pins" >
        {pins.map((pin, index) => (
          <div key={index} className="pin" onClick={() => navigate(`/pin/${pin._id}`)}>
            <div className="pinContent">
              <img src={`https://localhost:5000/public/pins/${pin.image}`} alt={pin.title} loading="lazy"/>
              <p className="pinTitle">{pin.title}</p>
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