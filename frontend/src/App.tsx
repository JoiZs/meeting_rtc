import { useEffect, useRef } from "react";
import { initiateOffer } from "./utils/peerconnection";
import socket from "./utils/sig_server";

function App() {
  const vdoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    socket.on("connect", () => {
      console.log(socket.id)
    })
  }, [])

  const initiateHandler = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
    vdoRef.current!.srcObject = stream
    await initiateOffer(stream);
  }

  return (
    <div className="App">
      <button onClick={initiateHandler}>
        Initiate
      </button>

      <div>
        <video autoPlay ref={vdoRef} controls />

      </div>
    </div>
  )
}

export default App;
