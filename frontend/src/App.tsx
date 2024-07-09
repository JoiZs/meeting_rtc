import React, { useEffect, useRef, useState } from 'react';
import DisplayCanvas from './components/displayCanvas';
import { answerCall, makeCall } from './utils/call';
import { callCn } from './utils/peerCn';
import socket from './utils/signalServer';


function App() {

  const vdoRef = useRef<HTMLVideoElement>(null)
  const remoteVdoRef = useRef<HTMLVideoElement>(null)
  const receiverRef = useRef<HTMLInputElement>(null)
  const callAcceptRef = useRef<HTMLButtonElement>(null)
  const callRejectRef = useRef<HTMLButtonElement>(null)

  const [vdStream, setVdStream] = useState<MediaStream | null>(null)
  const [meId, setMeId] = useState<string | null>(null)
  const [callingStatus, setCallingStatus] = useState<any>(null);
  const [senderId, setSenderId] = useState<string | null>(null)

  useEffect(() => {

    const createCameraStream = async () => {

      const videoStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true })
      vdoRef.current!.srcObject = videoStream
      setVdStream(videoStream)
    }

    createCameraStream()

    socket.on("me", (id) => setMeId(id))


    socket.on("dial-res", (data, callback) => {
      setSenderId(data.callerId);
      callAcceptRef.current!.onclick = () =>
        callback({ status: true })
      callRejectRef.current!.onclick = () => callback({ status: false })
    });
  }, [])

  const acceptCallHandler = async () => {
    await answerCall(vdStream, senderId, meId, remoteVdoRef)
  }

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
      <div>
        MyId: {meId}
      </div>
      <div style={{ display: "flex", flexDirection: "row", gap: "10px" }}><input style={{ width: "100%" }} placeholder='Caller Id' ref={receiverRef} /> <button onClick={() => { makeCall(vdStream, meId, receiverRef.current?.value, setCallingStatus, remoteVdoRef) }} >Call</button></div>
      <DisplayCanvas vdoRef={vdoRef} />
      <div>
        <p>
          Caller ID: {senderId}
        </p>
        <div>
          <button onClick={acceptCallHandler} ref={callAcceptRef}>Accept</button>
          <button ref={callRejectRef}>Reject</button>
        </div>
        {
          callingStatus &&
          <p>
            Status:
            {callingStatus?.message || null}

          </p>
        }
        <DisplayCanvas vdoRef={remoteVdoRef} />
      </div>
    </div>
  );
}

export default App;
