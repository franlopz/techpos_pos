import React, { useState, useEffect } from "react"
import PinBox from "../components/pin_login/PinBox"
import PinPad from "../components/pin_login/PinPad"
import useSambaLogin from "../hooks/useSambaLogin"
import Spinner from "../components/spinner/Spinner"
import useAuthSamba from "../hooks/useAuthSamba"
import { MSidebar } from "../components/Sidebar"
import openFullscreen from "../functions/activateFullScreen"
import LoginWave from "../components/pin_login/LoginWave"
import { useViewport } from "../context/ViewportContext"

const PinLogin = () => {
  const [pin, setPin] = useState("")
  const [loader, setLoader] = useState(false)
  const [authSambaUser] = useSambaLogin()
  const [authSamba] = useAuthSamba()
  const { width, height } = useViewport()

  const handlePinPadClick = async (e, retries = 3) => {
    if (e === "X") {
      return setPin("")
    }

    if (e === "enter") {
      try {
        setLoader(true)
        await authSamba()
        setLoader(false)
        await authSambaUser({ pin, setPin })
        return
      } catch (error) {
        setLoader(false)
        return setPin("")
      }
    }

    setPin(pin.toString() + e.toString())
  }

  const maxWidth = () => {
    if (height < 600) return "max-w-[220px]"
    if (height < 750) return "max-w-[320px]"

    return "max-w-[420px]"
  }

  const getHeight = () => {
    return `h-[${height}px] flex flex-col`
  }

  return (
    <div
      onClick={() => openFullscreen()}
      style={{ height: height, display: "flex", flexDirection: "column" }}
    >
      <LoginWave />
      <MSidebar />
      {loader ? <Spinner /> : null}
      <div className='flex w-full h-full items-center justify-center overflow-auto'>
        <div
          className={`border bg-white drop-shadow-2xl rounded-3xl flex flex-col aspect-[3/4] mx-12 w-full ${maxWidth()}`}
        >
          <PinBox pin={pin} />
          <PinPad handlePinPadClick={handlePinPadClick} />
        </div>
      </div>
    </div>
  )
}

export default PinLogin
