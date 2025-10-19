import React, { useEffect, useState } from "react";
import { loadFirebaseConfig } from "../firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
  onSnapshot,
  query,
  orderBy,
  doc,
  getDoc,
} from "firebase/firestore";

export default function Chat() {
  const [authData, setAuthData] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  useEffect(() => {
    (async () => {
      const { auth, app } = await loadFirebaseConfig();
      const db = getFirestore(app);
      setAuthData({ auth, db });

      onAuthStateChanged(auth, async (user) => {
        if (user) {
          listenMessages(db, user);
        }
      });
    })();
  }, []);

  const listenMessages = (db, user) => {
    const q = query(collection(db, "messages"), orderBy("time"));
    onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(data);
    });
  };

  const sendMessage = async () => {
    if (!text.trim() || !authData) return;
    const { auth, db } = authData;
    const user = auth.currentUser;
    const userDoc = await getDoc(doc(db, "users", user.uid));

    const fullname = userDoc.exists() ? userDoc.data().fullname : user.email;

    await addDoc(collection(db, "messages"), {
      sender: user.email,
      fullname,
      text: text.trim(),
      time: serverTimestamp(),
    });

    setText("");
  };

  return (
    <div className="flex flex-col w-full max-w-2xl mx-auto p-6 bg-gray-50 rounded-2xl shadow-md h-[80vh]">
      <h2 className="text-2xl font-semibold text-center text-blue-600 mb-4">
        💬 Chat Real-time
      </h2>

      <div className="flex-1 overflow-y-auto bg-white border rounded-lg p-4 space-y-3 shadow-inner">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${
              authData?.auth?.currentUser?.email === msg.sender
                ? "items-end"
                : "items-start"
            }`}
          >
            <div
              className={`px-3 py-2 rounded-xl text-sm max-w-[75%] ${
                authData?.auth?.currentUser?.email === msg.sender
                  ? "bg-blue-500 text-white rounded-br-none"
                  : "bg-gray-200 text-gray-900 rounded-bl-none"
              }`}
            >
              <div className="text-xs font-semibold opacity-70 mb-1">
                {msg.fullname}
              </div>
              <div>{msg.text}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-2 mt-4">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Ketik pesan..."
          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          onClick={sendMessage}
          className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Kirim
        </button>
      </div>
    </div>
  );
}
