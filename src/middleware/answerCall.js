import socket from '../socket_io/socket'
import Peer from 'simple-peer'

const answerCall = ({
  caller,
  callerSignal,
  stream,
  setCallAccepted,
  userVideo,
  connectionRef,
}) => {
  setCallAccepted(true)
  const peer = new Peer({
    initiator: false,
    trickle: false,
    stream: stream,
  })

  peer.on('signal', (data) => {
    socket.emit('answerCall', { signal: data, to: caller })
  })

  peer.on('stream', (mStream) => {
    userVideo.current.srcObject = mStream
  })

  peer.signal(callerSignal)
  connectionRef.current = peer
}

export default answerCall
