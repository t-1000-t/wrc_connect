import socket from '../index'

const leaveCall = ({ setCallEnded }) => {
  setCallEnded(true)

  socket.on('disconnect')
  console.log('Socket Closed. ')
}

export default leaveCall
