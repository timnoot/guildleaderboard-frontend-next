import '../styles/globals.css'
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router'
import { LoadingScreen } from '../components/Screens.js';

function Loading() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleStart = (url) => (url !== router.asPath) && setLoading(true);
    // const handleComplete = (url) => (url === router.asPath) && setLoading(false);
    const handleComplete = (url) => setLoading(false);

    router.events.on('routeChangeStart', handleStart)
    router.events.on('routeChangeComplete', handleComplete)
    router.events.on('routeChangeError', handleComplete)

    return () => {
      router.events.off('routeChangeStart', handleStart)
      router.events.off('routeChangeComplete', handleComplete)
      router.events.off('routeChangeError', handleComplete)
    }
  })

  return loading && <LoadingScreen />
}

function MyApp({ Component, pageProps }) {
  return (
    <div className='overflow-x-hidden'>
      <Loading />
      <Component {...pageProps} />
    </div>
  )
}

export default MyApp
