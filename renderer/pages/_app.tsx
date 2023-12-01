import React from 'react'
import type { AppProps } from 'next/app'

import '../styles/globals.css'
import { CortexProvider } from '../context/CortexContext'

function MyApp({ Component, pageProps }: AppProps) {
  return (
  <CortexProvider>
    <Component {...pageProps} />
  </CortexProvider>
  )
}

export default MyApp
