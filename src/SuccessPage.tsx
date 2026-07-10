import { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from './firebase'; 

const SuccessPage = () => {
  const [searchParams] = useSearchParams();
  const checkoutId = searchParams.get('checkout_id');
  const navigate = useNavigate();

  useEffect(() => {
    if (checkoutId) {
      verifyAndUpgrade(checkoutId);
    }
  }, [checkoutId]);

  const verifyAndUpgrade = async (id: string) => {
    try {
      const response = await fetch(`https://api.polar.sh/v1/checkouts/${id}`, {
        headers: { 
          // અહીં તમારા ડેવલપર ટોકનનો ઉપયોગ થશે
            'Authorization': `Bearer ${import.meta.env.VITE_POLAR_API_TOKEN}` 
        }
      });
      
      const data = await response.json();

      if (data.status === 'succeeded') {
        const uid = data.metadata.firebase_uid; 
        if (uid) {
          await updateDoc(doc(db, "users", uid), { role: "pro" });
          alert("Success! તમે હવે Pro મેમ્બર છો.");
          navigate('/dashboard'); 
        }
      }
    } catch (err) {
      console.error("વેરિફિકેશન એરર:", err);
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h2>પેમેન્ટ વેરિફાય થઈ રહ્યું છે...</h2>
      <p>કૃપા કરીને થોડી રાહ જુઓ.</p>
    </div>
  );
};

export default SuccessPage;