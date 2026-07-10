import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { db } from "./firebase";

const SuccessPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const checkoutId = searchParams.get("checkout_id");

  useEffect(() => {
    if (checkoutId) {
      verifyAndUpgrade(checkoutId);
    }
  }, [checkoutId]);

  const verifyAndUpgrade = async (id: string) => {
    try {
      console.log("🚀 Starting payment verification...");
      console.log("Checkout ID:", id);

      //const response = await fetch(
        //`https://api.polar.sh/v1/checkouts/${id}`,

        const response = await fetch(
        `https://sandbox-api.polar.sh/v1/checkouts/${id}`,
        {
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_POLAR_API_TOKEN}`,
          },
        }
      );

      console.log("API Status:", response.status);

      const data = await response.json();

      console.log("========== POLAR RESPONSE ==========");
      console.log(data);
      console.log("Checkout Status:", data.status);
      console.log("Metadata:", data.metadata);

      if (data.status !== "succeeded") {
        console.log("❌ Payment is not succeeded.");
        return;
      }

      const auth = getAuth();

      onAuthStateChanged(auth, async (user) => {
        console.log("========== FIREBASE USER ==========");
        console.log(user);

        if (!user) {
          console.error("❌ No logged in user found.");
          return;
        }

        console.log("Firebase UID:", user.uid);

        try {
          await setDoc(
            doc(db, "users", user.uid),
            {
              role: "pro",
              upgradedAt: new Date().toISOString(),
            },
            { merge: true }
          );

          console.log("✅ Firestore Updated Successfully");

          alert("🎉 Payment Successful! You are now a Pro user.");

          navigate("/dashboard", { replace: true });
        } catch (firestoreError) {
          console.error("❌ Firestore Error:", firestoreError);
        }
      });
    } catch (error) {
      console.error("❌ Verification Error:", error);
      alert("Payment verification failed.");
    }
  };

  return (
    <div
      style={{
        display: "grid",
        placeItems: "center",
        minHeight: "100vh",
        textAlign: "center",
      }}
    >
      <div>
        <h2>Payment Verification...</h2>
        <p>Please wait while we verify your payment.</p>
      </div>
    </div>
  );
};

export default SuccessPage;