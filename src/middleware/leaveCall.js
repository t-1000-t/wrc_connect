import socket from '../socket_io/socket'

const leaveCall = ({ setCallEnded }) => {
  setCallEnded(true)

  socket.on('disconnect')
  console.log('Socket Closed. ')
}

export default leaveCall
