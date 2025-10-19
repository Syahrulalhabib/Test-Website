import React, { useEffect, useState } from "react";
import axios from "axios";
import { loadFirebaseConfig } from "../firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";

export default function Profile() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    (async () => {
      const { auth } = await loadFirebaseConfig();
      onAuthStateChanged(auth, async (u) => {
        if (u) {
          const token = await u.getIdToken();
          const res = await axios.get("http://localhost:8080/profile", {
            headers: { Authorization: `Bearer ${token}` },
          });
          setProfile(res.data);
        }
      });
    })();
  }, []);

  if (!profile) return <p>Loading profile...</p>;

  return (
    <div className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-md mx-auto text-center">
      <img
        src={profile.photoURL || "https://via.placeholder.com/100"}
        alt="avatar"
        className="w-24 h-24 mx-auto rounded-full mb-4 border-4 border-blue-200"
      />
      <h1 className="text-2xl font-semibold">{profile.fullname}</h1>
      <p className="text-gray-500">{profile.email}</p>
      <p className="mt-2 text-gray-400">Gender: {profile.gender || "—"}</p>
    </div>
  );
}
