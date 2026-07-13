import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { db } from "./firebase";

const SuccessPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [statusMessage, setStatusMessage] = useState("Please wait while we verify your payment.");

  const checkoutId = searchParams.get("checkout_id");

  useEffect(() => {
    if (checkoutId) {
      verifyAndUpgrade(checkoutId);
    }
  }, [checkoutId]);

  const verifyAndUpgrade = async (id: string) => {
    try {
      console.log("🚀 Starting payment verification via Vercel Backend...");
      setStatusMessage("Verifying your payment with Polar...");

      const auth = getAuth();

      // પહેલા ચેક કરીએ કે યુઝર લોગ્ડ-ઈન છે કે નહીં
      onAuthStateChanged(auth, async (user) => {
        if (!user) {
          console.error("❌ No logged in user found.");
          setStatusMessage("Error: No logged in user found. Please login again.");
          return;
        }

        console.log("Firebase UID:", user.uid);

        // આપણા Vercel Serverless API ને કોલ કરીએ (આમાં કોઈ સિક્રેટ કી બ્રાઉઝરમાં નહીં દેખાય)
        const response = await fetch("/api/verify-polar", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ checkoutId: id }),
        });

        console.log("Backend API Status:", response.status);
        const data = await response.json();

        if (!response.ok || !data.success) {
          console.log("❌ Payment verification failed on backend:", data.error || data.message);
          setStatusMessage("Payment verification failed. If amount was deducted, please contact support.");
          return;
        }

        // જો બેકએન્ડ હા પાડે, તો જ ફ્રન્ટએન્ડથી ફાયરસ્ટોર અપડેટ સેફલી થશે
        console.log("✅ Backend verified successfully. Upgrading user in Firestore...");
        setStatusMessage("Payment verified! Upgrading your account to Pro...");

        try {
          await setDoc(
            doc(db, "users", user.uid),
            {
              role: "pro",
              upgradedAt: new Date().toISOString(),
            },
            { merge: true }
          );

          console.log("🎉 Firestore Updated Successfully");
          navigate("/", { replace: true });
        } catch (firestoreError) {
          console.error("❌ Firestore Error:", firestoreError);
          setStatusMessage("Account upgraded failed in database. Please contact support.");
        }
      });
    } catch (error) {
      console.error("❌ Verification Error:", error);
      setStatusMessage("An unexpected error occurred during verification.");
    }
  };

  return (
    <div
      style={{
        display: "grid",
        placeItems: "center",
        minHeight: "100vh",
        textAlign: "center",
        fontFamily: "sans-serif"
      }}
    >
      <div>
        <h2>Payment Verification</h2>
        <p>{statusMessage}</p>
      </div>
    </div>
  );
};

export default SuccessPage;