import React, { useEffect, useRef, useState } from 'react'
import io from 'socket.io-client'
import { Button, IconButton, TextField } from '@material-ui/core'
import PhoneIcon from '@material-ui/icons/Phone'
import callUser from '../middleware/callUser'
import leaveCall from '../middleware/leaveCall'
import answerCall from '../middleware/answerCall'
import { Card, CardBody, Grid, Heading, Stack } from '@chakra-ui/react'

import socket from '../index'

const BoardRoom = () => {
  const [stream, setStream] = useState()
  const [me, setMe] = useState('')
  const [receivingCall, setReceivingCall] = useState(false)
  const [caller, setCaller] = useState('')
  const [callerSignal, setCallerSignal] = useState()
  const [callAccepted, setCallAccepted] = useState(false)
  const [idToCall, setIdToCall] = useState('')
  const [callEnded, setCallEnded] = useState(false)
  const [name, setName] = useState('')

  const myVideo = useRef()
  const userVideo = useRef()
  const connectionRef = useRef()

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((mStream) => {
      setStream(mStream)
      myVideo.current.srcObject = mStream
    })

    socket.on('me', (id) => {
      setMe(id)
      console.log('id', id)
    })

    socket.emit('message:created', 'Emit sent FRONT to Mango server!')

    socket.on('message:created', (message) => {
      console.log('New message FRONT!', message)
      io.emit('message:created', message)
    })

    socket.on('callUser', (data) => {
      setReceivingCall(true)
      setCaller(data.from)
      setName(data.name)
      setCallerSignal(data.signal)
    })

    socket.on('disconnect', () => {
      socket.disconnect()
      console.log('Disconnect server!')
    })
  }, [])

  return (
    <>
      <Card maxW='sm'>
        <CardBody>
          <div className='video-container'>
            <div className='video'>
              {stream && (
                <video playsInline muted ref={myVideo} autoPlay style={{ width: '300px' }} />
              )}
            </div>
            <div className='video'>
              {callAccepted && !callEnded ? (
                <video playsInline ref={userVideo} autoPlay style={{ width: '300px' }} />
              ) : null}
            </div>
          </div>
          <Stack mt='6' spacing='3'>
            <Heading size='md'>
              <TextField
                id='filled-basic'
                label='Caller ID'
                variant='filled'
                value={me}
                onChange={(e) => setName(e.target.value)}
                style={{ marginBottom: '20px' }}
              />
            </Heading>
          </Stack>
          <Grid spacing='2' templateColumns='repeat(2, 1fr)' gap={4}>
            <TextField
              id='filled-basic'
              label='Name'
              variant='filled'
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{ marginBottom: '20px' }}
            />
            <TextField
              id='filled-basic'
              label='ID to call'
              variant='filled'
              value={idToCall}
              onChange={(e) => setIdToCall(e.target.value)}
            />
            <div className='call-button'>
              {callAccepted && !callEnded ? (
                <Button
                  variant='contained'
                  ref={connectionRef}
                  color='secondary'
                  onClick={() => leaveCall({ setCallEnded, stream, connectionRef })}
                >
                  End Call
                </Button>
              ) : (
                <IconButton
                  color='primary'
                  aria-label='call'
                  onClick={() =>
                    callUser({
                      idToCall,
                      me,
                      name,
                      stream,
                      userVideo,
                      setCallAccepted,
                      connectionRef,
                    })
                  }
                >
                  <PhoneIcon fontSize='large' />
                </IconButton>
              )}
            </div>
            {receivingCall && !callAccepted ? (
              <div className='caller'>
                <h1>{name} is calling...</h1>
                <Button
                  variant='contained'
                  color='primary'
                  onClick={() =>
                    answerCall({
                      caller,
                      callerSignal,
                      stream,
                      setCallAccepted,
                      userVideo,
                      connectionRef,
                    })
                  }
                >
                  Answer
                </Button>
              </div>
            ) : null}
          </Grid>
        </CardBody>
      </Card>
    </>
  )
}

export default BoardRoom
