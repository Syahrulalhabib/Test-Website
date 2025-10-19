import axios from "axios";
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

let cachedConfig = null;

export async function loadFirebaseConfig() {
  if (cachedConfig) return cachedConfig;

  try {
    const response = await axios.get("http://localhost:8080/config");
    const firebaseConfig = response.data.firebaseConfig;

    if (!firebaseConfig || !firebaseConfig.apiKey) {
      throw new Error("Firebase config tidak valid dari backend");
    }

    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const provider = new GoogleAuthProvider();

    cachedConfig = { app, auth, provider };
    return cachedConfig;
  } catch (error) {
    console.error("❌ Gagal memuat konfigurasi Firebase:", error);
    throw error;
  }
}
