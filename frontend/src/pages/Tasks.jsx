import React, { useEffect, useState } from "react";
import { loadFirebaseConfig } from "../firebaseConfig";
import {
  getFirestore,
  collection,
  getDocs,
  query,
  where,
  updateDoc,
  doc,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import TaskCard from "../components/TaskCard";

export default function Tasks() {
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState("");

  useEffect(() => {
    (async () => {
      const { auth, app } = await loadFirebaseConfig();
      const db = getFirestore(app);

      onAuthStateChanged(auth, async (u) => {
        if (u) {
          setUser(u);

          // Ambil data role user dari Firestore
          const usersRef = collection(db, "users");
          const snapshot = await getDocs(query(usersRef, where("email", "==", u.email)));
          const userData = snapshot.docs[0]?.data();
          setRole(userData?.role || "member");

          // Query tugas berdasarkan role
          const taskRef = collection(db, "tasks");
          let q;

          if (userData?.role === "pm") {
            q = query(taskRef, where("projectManager", "==", u.email));
          } else {
            q = query(taskRef, where("assignee", "==", u.email));
          }

          const taskSnap = await getDocs(q);
          setTasks(taskSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
          setLoading(false);
        }
      });
    })();
  }, []);

  // Update status tugas
  const handleStatusChange = async (taskId, newStatus) => {
    const { app } = await loadFirebaseConfig();
    const db = getFirestore(app);
    const taskRef = doc(db, "tasks", taskId);
    await updateDoc(taskRef, { status: newStatus });
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
    );
  };

  if (loading) return <p className="text-center mt-10">Loading tasks...</p>;

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold text-blue-600 mb-6">Daftar Tugas</h1>

      {tasks.length === 0 ? (
        <p className="text-gray-500 text-center mt-10">
          Belum ada tugas untuk kamu.
        </p>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {tasks.map((t) => (
            <TaskCard
              key={t.id}
              task={t}
              role={role}
              onStatusChange={handleStatusChange}
            />
          ))}
        </div>
      )}
    </div>
  );
}
