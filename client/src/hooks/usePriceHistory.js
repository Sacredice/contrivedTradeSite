import { useEffect, useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../config/firebaseConfig'; 


  const usePriceHistory = (material) => {
    const [historyData, setHistoryData] = useState(null);
    const [error, setError] = useState(null);


    useEffect(() => {
        const docRef = doc(db, "prices", material);
        const unsubscribe = onSnapshot(docRef, (doc) => {
            setHistoryData(doc.data());
        }, (error) => {
          console.error("Error fetching real-time data: ", error.message);
          setError(error);
        });
   
        // Clean up the listener on component unmount
        return () => unsubscribe();
      }, [setHistoryData, setError]);
    
      return { historyData, error, };
    };

    export default usePriceHistory;