import React from 'react'

type Props = { vdoRef: React.RefObject<HTMLVideoElement> }

function DisplayCanvas({ vdoRef }: Props) {

  return (
    <video ref={vdoRef} autoPlay muted controls style={{ width: "100%" }} />

  )
}

export default DisplayCanvas
