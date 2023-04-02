import Peer from 'simple-peer'
import socket from '../index'

const callUser = ({
  idToCall,
  me,
  name,
  stream,
  userVideo,
  setCallAccepted,
  connectionRef,
  setDataSignal,
}) => {
  const peer = new Peer({
    initiator: true,
    trickle: false,
    stream: stream,
  })

  peer.on('signal', (data) => {
    socket.emit('callUser', {
      userToCall: idToCall,
      signalData: data,
      from: me,
      name: name,
    })

    peer.on('stream', (mStream) => {
      userVideo.current.srcObject = mStream
    })

    socket.on('callAccepted', (signal) => {
      setCallAccepted(true)
      peer.signal(signal)
    })

    connectionRef.current = peer
  })
}

export default callUser
