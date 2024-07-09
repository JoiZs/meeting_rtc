import React from "react"
import { iceServer } from "../consts";
import socket from "./signalServer"

export const makeCall = async (vdo: MediaStream | null, callerId: string | null, receiverId: string | undefined, setStat: React.Dispatch<React.SetStateAction<boolean>>, remoteVdoRef: React.RefObject<HTMLVideoElement>) => {
  const res = await socket.emitWithAck("dial", { callerId, receiverId });
  setStat(res)

  if (res.status) {
    const peerCn = new RTCPeerConnection({ iceServers: [{ urls: iceServer }] })

    socket.on("rtc-sd", data => {
      const ans = new RTCSessionDescription(data.sessionDp)
      peerCn.setRemoteDescription(ans)
    })

    socket.on("ice-cd", async data => {
      peerCn.addIceCandidate(data.iceCd)
    })

    peerCn.ontrack = e => {
      const [remoteStream] = e.streams;
      remoteVdoRef.current!.srcObject = (remoteStream)
    }

    if (vdo)
      vdo.getTracks().forEach(el => {
        peerCn.addTrack(el, vdo)
      })

    peerCn.onicecandidate = e => {
      socket.emit("ice-cd", { callerId, receiverId, iceCd: e.candidate })
    }

    const offer = await peerCn.createOffer();
    peerCn.setLocalDescription(offer);
    socket.emit("rtc-sd", { callerId, receiverId, sessionDp: offer })



  }

}


export const answerCall = async (vdo: MediaStream | null, callerId: string | null, receiverId: string | null, remoteVdoRef: React.RefObject<HTMLVideoElement>) => {

  const peerCn = new RTCPeerConnection({ iceServers: [{ urls: iceServer }] })

  socket.on("rtc-sd", async data => {
    const offer = new RTCSessionDescription(data.sessionDp)
    peerCn.setRemoteDescription(offer)
    const ans = await peerCn.createAnswer();
    peerCn.setLocalDescription(ans);
    socket.emit("rtc-sd", { callerId, receiverId, sessionDp: ans })
  })

  socket.on("ice-cd", async data => {
    peerCn.addIceCandidate(data.iceCd)
  })

  peerCn.ontrack = e => {
    const [remoteStream] = e.streams;
    remoteVdoRef.current!.srcObject = (remoteStream)
  }

  if (vdo)
    vdo.getTracks().forEach(el => {
      peerCn.addTrack(el, vdo)
    })

  peerCn.onicecandidate = e => {
    socket.emit("ice-cd", { callerId, receiverId, iceCd: e.candidate })
  }



}

