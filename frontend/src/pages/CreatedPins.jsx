import { usePinContext } from "../context/PinContext"
import { Pin } from '../components/Pin'
import { CreateCollection } from "../components/CreateCollection"

export function CreatedPins() {
  const { createdPins } = usePinContext()

  return (
    <>
    <CreateCollection />
    <div className="pins" >
    {createdPins.map((pin, index) => (
      <Pin 
        key={pin._id}
        pin={pin}
        index={index + 1}
      />
    ))}
    </div>
    </>
  )
}