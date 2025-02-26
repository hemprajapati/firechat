import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as FBsignOut,
} from "firebase/auth";
import { app, db } from "@/firebase";
import { doc, setDoc, updateDoc } from "firebase/firestore";

export const auth = getAuth(app);

export async function signUp(values) {
  const { email, password, firstName, lastName } = values;
  const { user } = await createUserWithEmailAndPassword(auth, email, password);
  await setDoc(doc(db, "users", user.uid), {
    uid: user.uid,
    firstName,
    lastName,
    email,
    createdAt: new Date(),
    isOnline: true,
  });
  return user;
}

export async function signIn(email, password) {
  const response = await signInWithEmailAndPassword(auth, email, password);
  const user = auth.currentUser;
  if (user) {
    await updateDoc(doc(db, "users", user.uid), {
      isOnline: true,
    });
  }
  return response;
}

export async function signOut() {
  const user = auth.currentUser;
  if (user) {
    await updateDoc(doc(db, "users", user.uid), {
      isOnline: false,
    });
  }
  return FBsignOut(auth);
}
