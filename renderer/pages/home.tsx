// pages/home.tsx
import React, { useEffect } from 'react';
import Head from 'next/head';
import Onboard from '../components/onboard';

const HomePage: React.FC = () => {
  useEffect(() => {
    fetch('/api/initDB')
      .then((res) => res.json())
      .then((data) => {
        console.log(data.message);
      })
      .catch((err) => {
        console.error('Error initializing database:', err);
      });
  }, []);

  return (
    <React.Fragment>
      <Head>
        <title>Cortex</title>
      </Head>
      <Onboard />
    </React.Fragment>
  );
};

export default HomePage;