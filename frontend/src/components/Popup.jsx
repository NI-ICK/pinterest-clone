import { useFormDataContext } from "../context/FormDataContext"

export function Popup() {
  const { showPopup, popupText } = useFormDataContext()

  return (
    <>
      <div className={`popup ${showPopup ? 'show' : ''}`}>
        <p>{popupText}</p>
      </div>
    </>
  )
}