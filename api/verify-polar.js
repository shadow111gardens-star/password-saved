export default async function handler(req, res) {
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

  const { checkoutId } = req.body;

  if (!checkoutId) {
    return res.status(400).json({ error: 'Checkout ID is required' });
  }

  try {
    const polarToken = process.env.POLAR_API_TOKEN;

    // ૧. લાઈવ Polar API પર રિક્વેસ્ટ જશે
    const response = await fetch(`https://api.polar.sh/v1/checkouts/${checkoutId}`, {
      headers: {
        Authorization: `Bearer ${polarToken}`,
      },
    });

    // ૨. આ નવો લોગ એરર પકડવા માટે ઉમેર્યો છે
    console.log("Polar API Response Status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ Polar API Error Response:", errorText); // આ વેરસેલ લોગ્સમાં દેખાશે
      return res.status(500).json({ error: `Failed to fetch from Polar: ${response.status}`, details: errorText });
    }

    const polarData = await response.json();
    console.log("✅ Polar Data Received Status:", polarData.status);

    if (polarData.status !== 'succeeded') {
      return res.status(200).json({ success: false, message: `Payment status is ${polarData.status}` });
    }

    return res.status(200).json({ success: true, message: 'Payment verified successfully' });

  } catch (error) {
    console.error('Live Verification Error:', error);
    return res.status(500).json({ error: error.message });
  }
}