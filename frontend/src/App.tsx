import { useEffect } from "react";
import { initiateOffer } from "./utils/peerconnection";
import socket from "./utils/sig_server";

function App() {

  useEffect(() => {
    socket.on("connect", () => {
      console.log(socket.id)
    })
  }, [])

  return (
    <div className="App">
      <button onClick={async () => await initiateOffer()}>
        Initiate
      </button>
    </div>
  )
}

export default App;
