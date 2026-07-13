export default async function handler(req, res) {
  // CORS Headers સેટ કરવા જેથી React માંથી રિક્વેસ્ટ આવી શકે
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { checkoutId, uid } = req.body;

  if (!checkoutId || !uid) {
    return res.status(400).json({ error: 'Checkout ID and UID are required' });
  }

  try {
    // Vercel ના ડેશબોર્ડમાંથી આ ટોકન સિક્રેટલી લોડ થશે
    const polarToken = process.env.POLAR_API_TOKEN;

    const response = await fetch(`https://api.polar.sh/v1/checkouts/${checkoutId}`, {
      headers: {
        Authorization: `Bearer ${polarToken}`,
      },
    });

    if (!response.ok) {
      return res.status(500).json({ error: 'Failed to fetch from Polar Live API' });
    }

    const polarData = await response.json();

    if (polarData.status !== 'succeeded') {
      return res.status(200).json({ success: false, message: 'Payment not succeeded' });
    }

    // નોંધ: અહીંથી સીધું Firebase Firestore અપડેટ કરવા માટે આપણે React ફ્રન્ટએન્ડને સક્સેસ રિસ્પોન્સ મોકલીશું 
    // અથવા તમે અહીં Firebase Admin SDK સેટ કરી શકો છો. પણ સૌથી સરળ રસ્તો એ છે કે:
    return res.status(200).json({ success: true, message: 'Payment verified successfully' });

  } catch (error) {
    console.error('Live Verification Error:', error);
    return res.status(500).json({ error: error.message });
  }
}