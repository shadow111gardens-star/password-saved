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

    if (eventType === 'subscription.created' || eventType === 'subscription.updated') {
      const subscription = body.data;

      if (subscription.status === 'active') {
        const firebaseUserId = subscription.metadata?.firebase_user_id;

        if (firebaseUserId) {
          // Firebase Firestore માં યુઝરનો રોલ અપડેટ કરો
          await db.collection('users').doc(firebaseUserId).update({
            role: 'pro',
            updatedAt: new Date().toISOString()
          });
          
          console.log(`User ${firebaseUserId} successfully upgraded to Pro!`);
        }
      }
    }

    return res.status(200).json({ received: true });
  } catch (error) {
    console.error('Webhook Error:', error);
    return res.status(500).json({ error: 'Webhook handler failed' });
  }
}