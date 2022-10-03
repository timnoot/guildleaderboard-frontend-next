import '../styles/globals.css'
import React, { useEffect } from 'react';
import { useRouter } from 'next/router'


function MyApp({ Component, pageProps }) {
  const router = useRouter();
  useEffect(() => {
    if (location.hash.startsWith('#/')) { // checking if it's HashRoute
      router.push(location.hash.substr(1)); // removing the #/ from the hash
    }
  }, [])
  return <Component {...pageProps} />
}

export default MyApp
