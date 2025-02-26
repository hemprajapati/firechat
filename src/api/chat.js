import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  addDoc,
  onSnapshot,
  deleteDoc,
  doc
} from "firebase/firestore";
import { db, authReady, auth } from "@/firebase";

export const sendMessage = async ({message,sendTo}) => {
  await authReady;
  const messagesRef = collection(db, "messages");
  const senderId = auth.currentUser.uid;
  await addDoc(messagesRef, {
    message,
    senderId,
    sendTo, 
    timestamp: Date.now(),
  });
};

export const fetchMessages = async (lastDoc = null, userId, pageSize = 10) => {
  await authReady;
  const senderId = auth.currentUser.uid;
  const messagesRef = collection(db, "messages");

  let q = query(
    messagesRef,
    where("sendTo", "in", [senderId, userId]),
    where("senderId", "in", [senderId, userId]),
    orderBy("timestamp", "asc"),
    limit(pageSize)
  );

  if (lastDoc) {
    q = query(
      messagesRef,
      where("sendTo", "in", [senderId, userId]),
      where("senderId", "in", [senderId, userId]),
      orderBy("timestamp", "asc"),
      startAfter(lastDoc),
      limit(pageSize)
    );
  }

  const snapshot = await getDocs(q);
  const messages = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

  return {
    messages,
    lastDoc: snapshot.docs[snapshot.docs.length - 1] || null,
  };
};

export const listenForNewMessages = (userId, callback) => {
  const messagesRef = collection(db, "messages");
  const senderId = auth.currentUser.uid;
  const addedMessageIds = new Set();

  const q = query(
    messagesRef,
    where("sendTo", "in", [senderId, userId]),
    where("senderId", "in", [senderId, userId]),
    orderBy("timestamp", "asc")
  );

  return onSnapshot(q, (snapshot) => {
    snapshot.docChanges().forEach((change) => {
      const newMessage = { id: change.doc.id, ...change.doc.data() };
      if (change.type === "added") {
        if (
          (newMessage.sendTo === userId && newMessage.senderId === senderId) ||
          (newMessage.sendTo === senderId && newMessage.senderId === userId)
        ) {
          if (!addedMessageIds.has(newMessage.id)) {
            addedMessageIds.add(newMessage.id);
            callback({ type: "added", message: newMessage });
          }
        }
      } else if (change.type === "removed") {
        callback({ type: "removed", message: newMessage });
      }
    });
  });
};

export const deleteMessage = async (messageId) => {
  await authReady;
  const messageRef = doc(db, "messages", messageId);
  await deleteDoc(messageRef);
};

export const getActiveChatUserInfo = async(userID) =>{
  try {
    const q = query(
      collection(db, "users"),
      where("uid", "==", userID)
    );
    const querySnapshot = await getDocs(q);
    const users = querySnapshot.docs.map((doc) => ({
      ...doc.data(),
    }));
    return users;
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
}