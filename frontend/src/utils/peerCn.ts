import { iceServer } from '../consts'
import socket from './signalServer'


export const callCn = async (vdoStream: MediaStream | null, callerId: string, receiverId: string) => {

  const peerCn = new RTCPeerConnection({ iceServers: [{ urls: iceServer }] })

  socket.on("ice-cd", ({ iceCd }) => {
    if (iceCd) {
      try {
        peerCn.addIceCandidate(iceCd)
      } catch (error) {
        console.log(error)
      }
    }
  })

  if (vdoStream) {
    vdoStream.getTracks().forEach((el) => {
      peerCn.addTrack(el)
    })
  }

  socket.on("rtc-sd", async ({ sessionDp }) => {
    if (sessionDp) {
      const remoteDc = new RTCSessionDescription(sessionDp);
      await peerCn.setRemoteDescription(remoteDc);
    }

  })

  peerCn.ontrack = (e) => {
    const [remoteStream] = e.streams;
    console.log(remoteStream)
  }

  const offer = await peerCn.createOffer();
  await peerCn.setLocalDescription(offer);

  socket.emit("rtc-sd", { sessionDp: offer, callerId: callerId })

  peerCn.onicecandidate = e => {
    if (e.candidate) {
      console.log(e.candidate)
      socket.emit("ice-cd", { iceCd: e.candidate, callerId: callerId })
    }
  }
  peerCn.onconnectionstatechange = e => {
    console.log(peerCn.connectionState)
  }
}


export const AnsCn = async (answerId: string) => {
  const peerCn = new RTCPeerConnection({ iceServers: [{ urls: iceServer }] })
  socket.on("ice-cd", ({ iceCd }) => {
    peerCn.addIceCandidate(iceCd)
  })

  socket.on("rtc-sd", async ({ sessionDp }) => {
    if (sessionDp) {
      const remoteDc = new RTCSessionDescription(sessionDp);
      await peerCn.setRemoteDescription(remoteDc);
    }
  })




  const answer = await peerCn.createAnswer();
  await peerCn.setLocalDescription(answer);

  socket.emit("rtc-sd", { sessionDp: answer, answerId: answerId })


  peerCn.onicecandidate = e => {
    if (e.candidate) {
      console.log(e.candidate)
      socket.emit("ice-cd", { iceCd: e.candidate, answerId: answerId })
    }
  }
  peerCn.onconnectionstatechange = e => {
    console.log(peerCn.connectionState)
  }

}
