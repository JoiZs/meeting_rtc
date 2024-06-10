import { StunServers } from "../consts"


export const initiateOffer = async (stream: MediaStream) => {
  const peerCn = new RTCPeerConnection({ iceServers: [{ urls: StunServers }] })
  const remoteStream = new MediaStream();


  stream.getTracks().forEach(et => {
    peerCn.addTrack(et, stream)
  })

  peerCn.ontrack = e => {
    e.streams[0].getTracks().forEach(et => {
      remoteStream.addTrack(et)
    })
  }

  peerCn.onicecandidate = async (e) => {
    if (e.candidate) {
      console.log(e.candidate)
    }
  }

  const offer = await peerCn.createOffer();
  await peerCn.setLocalDescription(offer);
  console.log(offer)
}
