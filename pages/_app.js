import React from 'react';
import Head from 'next/head';
import '../styles/styles.css';

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head />
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
