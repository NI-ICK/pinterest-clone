import React, { useCallback, useState, useEffect, useRef } from 'react'
import { useDropzone } from 'react-dropzone'
import { useFormDataContext } from '../context/FormDataContext'

export function Dropzone() {
  const onDrop = useCallback(acceptedFiles => {
    const file = acceptedFiles[0]
    setSelectedImage(URL.createObjectURL(file))
  }, [])
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    accept: { "image/*": [] },
    multiple: false 
  })
  
  const [hover, setHover] = useState(false)
  const [selectedImage, setSelectedImage] = useState(null)
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 })
  const { handleCreatePinChange } = useFormDataContext()
  const fileInput = useRef()

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if(file) setSelectedImage(URL.createObjectURL(file))
  }

  const handleInputClick = () => {
    fileInput.current.click()
  }

  useEffect(() => {
    if (selectedImage) {
      const img = new Image()
      img.onload = function() {
        setImageDimensions({ width: img.width, height: img.height })
      }
      img.src = selectedImage
    }

    return () => { 
      if(selectedImage) URL.revokeObjectURL(selectedImage)
    }
  }, [selectedImage])

  useEffect(() => {
    setHover(isDragActive)
  }, [isDragActive])

    const calcDropzoneSize = () => {
        const maxWidth = 23.75 * 16
        const maxHeight = 30 * 16

        if (imageDimensions.width === 0 || imageDimensions.height === 0) return { width: '23.75em', height: '30em' }

        const scale = Math.min(maxWidth / imageDimensions.width, maxHeight / imageDimensions.height)

        return {
            width: `${imageDimensions.width * scale}px`,
            height: `${imageDimensions.height * scale}px`,
        }
    }
  
    const dropzoneSize = calcDropzoneSize()

  return (
    <div { ...getRootProps() }
      onClick={handleInputClick} 
      className={`dropzone ${hover ? 'hover' : '', selectedImage ? 'selected' : ''}`} 
      style={{ 
        backgroundImage: selectedImage ? `url(${selectedImage})` : null,
        width: dropzoneSize.width, 
        height: dropzoneSize.height,
        }}>
      <input { ...getInputProps() } 
      required 
      ref={fileInput} 
      name="image" 
      onChange={(e) => { 
        handleCreatePinChange(e)
        handleFileChange(e) 
        }}/>
      <p>Choose a file or drag and drop it here</p>
    </div>
  )
}