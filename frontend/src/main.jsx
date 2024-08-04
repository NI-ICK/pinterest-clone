import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { UserContextProvider } from './context/UserContext.jsx'
import { PinContextProvider } from './context/PinContext.jsx'
import { FormDataContextProvider } from './context/FormDataContext.jsx'
import { CollectionContextProvider } from './context/CollectionContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <UserContextProvider>
        <PinContextProvider>
          <CollectionContextProvider>
            <FormDataContextProvider>
              <App />
            </FormDataContextProvider>
          </CollectionContextProvider>
        </PinContextProvider>
      </UserContextProvider>
    </BrowserRouter>
  </React.StrictMode>
)
