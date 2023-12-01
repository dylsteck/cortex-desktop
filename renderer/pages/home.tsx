import React, { useEffect } from 'react';
import Head from 'next/head';
import { useCortex } from '../context/CortexContext';
import { dbExists } from '../lib/format';
import Timeline from '../components/Timeline';
import Onboard from '../components/Onboard';

const HomePage: React.FC = () => {
  const { onboarded, setOnboarded } = useCortex();
  useEffect(() => {
    async function checkIsDB(){
      const isDB = await dbExists()
      if(isDB && onboarded === false){
        setOnboarded(true);
      }
      else if(!isDB && onboarded === false){
        fetch('/api/initDB')
          .then((res) => res.json())
          .catch((err) => {
            console.error('Error initializing database:', err);
          });
      }
    }
    checkIsDB()
  }, [onboarded]);

  return (
    <React.Fragment>
      <Head>
        <title>Cortex</title>
      </Head>
      {onboarded ? <Timeline /> : <Onboard />}
    </React.Fragment>
  );
};

export default HomePage;