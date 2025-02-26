import { db, auth, authReady } from "@/firebase";
import { collection, getDocs, query, orderBy, limit, where } from "firebase/firestore";

export const getAllUsers = async (searchTerm = '') => {
  await authReady;
  const currentUser = auth.currentUser.uid;

  const usersRef = collection(db, "users");
  let usersQuery = query(usersRef, where("uid", "!=", currentUser));

  if (searchTerm) {
    usersQuery = query(usersRef, where("uid", "!=", currentUser), orderBy("name"), where("name", ">=", searchTerm), where("name", "<=", searchTerm + '\uf8ff'));
  }

  const usersSnapshot = await getDocs(usersQuery);

  const users = usersSnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }));

  const usersWithLastMessage = await Promise.all(
    users.map(async (user) => {
      const messagesRef = collection(db, "messages");
      const messagesQuery = query(
        messagesRef,
        where("sendTo", "in", [currentUser, user.uid]),
        where("senderId", "in", [currentUser, user.uid]),
        orderBy("timestamp", "desc"),
        limit(1)
      );

      const messagesSnapshot = await getDocs(messagesQuery);
      const lastMessage = messagesSnapshot.docs.length > 0
        ? messagesSnapshot.docs[0].data()
        : null;

      return {
        ...user,
        lastMessage: lastMessage ? {
          text: lastMessage.message,
          timestamp: lastMessage.timestamp,
          senderId: lastMessage.senderId
        } : null,
      };
    })
  );

  return usersWithLastMessage;
};

export const getLoginUser = async () => {
  await authReady;
  const usersRef = collection(db, "users");
  const currentUser = auth.currentUser.uid;

  let usersQuery = query(usersRef, where("uid", "==", currentUser));
  const usersSnapshot = await getDocs(usersQuery);
  const user = usersSnapshot.docs.length > 0
  ? usersSnapshot.docs[0].data()
  : null;
  return {user};
};
