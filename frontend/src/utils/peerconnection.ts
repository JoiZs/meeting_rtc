import { StunServers } from "../consts"


export const initiateOffer = async () => {
  const peerCn = new RTCPeerConnection({ iceServers: [{ urls: StunServers }] })

  const offer = await peerCn.createOffer();
  await peerCn.setLocalDescription(offer);

  console.log(offer)
  peerCn.addEventListener("icegatheringstatechange", (e) => {
    console.log(e)
  })

  peerCn.addEventListener("icecandidate", e => {
    console.log(e.candidate)
  })

}
