import '../styles/globals.scss'
import "prismjs/themes/prism-okaidia.css";

import { useEffect } from 'react';

import type { AppProps } from 'next/app'
import Prism from 'prismjs'



function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    Prism.highlightAll()
  })
  return <Component {...pageProps} />
}
export default MyApp
