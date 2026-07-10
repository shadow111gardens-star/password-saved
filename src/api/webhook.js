import admin from 'firebase-admin';

// Firebase Admin Initialize
if (!admin.apps.length) {
  admin.initializeApp({
    // વેરસેલ આ પ્રોજેક્ટને બેકએન્ડમાં આપોઆપ કનેક્ટ કરી લેશે
  });
}

const db = admin.firestore();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const body = req.body;
    const eventType = body.type;

    console.log("Received Polar Event:", eventType);

    // ચેક કરો કે ઇવેન્ટ સબ્સ્ક્રિપ્શનની છે કે ઓર્ડરની
    if (
      eventType === 'subscription.created' || 
      eventType === 'subscription.updated' || 
      eventType === 'order.created'
    ) {
      const dataObject = body.data;
      
      // સાચી કી (firebase_uid) દ્વારા આઈડી મેળવો
      const firebaseUserId = dataObject.metadata?.firebase_uid;

      console.log("Extracted Firebase UID:", firebaseUserId);

      if (firebaseUserId) {
        // ફાયરબેઝમાં યુઝરનો રોલ 'pro' અપડેટ કરો
        await db.collection('users').doc(firebaseUserId).update({
          role: 'pro',
          updatedAt: new Date().toISOString()
        });
        
        console.log(`User ${firebaseUserId} successfully upgraded to Pro!`);
        return res.status(200).json({ success: true, message: `Upgraded user ${firebaseUserId}` });
      } else {
        console.log("No firebase_uid found in metadata:", dataObject.metadata);
      }
    }

    return res.status(200).json({ received: true });
  } catch (error) {
    console.error('Webhook Error:', error);
    return res.status(500).json({ error: 'Webhook handler failed', details: error.message });
  }
}