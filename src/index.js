import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'
import io from 'socket.io-client'

const socket = io.connect('http://localhost:5000')
const root = ReactDOM.createRoot(document.getElementById('root'))

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
export default socket
