import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  sendPasswordResetEmail,
} from "firebase/auth";

import { useEffect, useState } from "react";
import { auth } from "../firebase/firebase.config";
import { AuthContext } from "./AuthContext";

const googleProvider = new GoogleAuthProvider();

// Create a fresh reference while preserving Firebase User methods
const createUserProxy = (firebaseUser) => {
  if (!firebaseUser) return null;

  return new Proxy(firebaseUser, {
    get(target, property) {
      const value = Reflect.get(target, property, target);

      if (typeof value === "function") {
        return value.bind(target);
      }

      return value;
    },
  });
};

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Register
  const registerUser = (email, password) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password);
  };

  // Login
  const signInUser = (email, password) => {
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password);
  };

  // Google Login
  const signInWithGoogle = () => {
    setLoading(true);
    return signInWithPopup(auth, googleProvider);
  };

  // Logout
  const logout = () => {
    setLoading(true);
    return signOut(auth);
  };

  // Update Firebase Profile
  const updateUserProfile = (profile) => {
    if (!auth.currentUser) {
      throw new Error("No authenticated user found.");
    }

    return updateProfile(auth.currentUser, profile);
  };

  // Refresh Firebase User
  const refreshUser = async () => {
    if (!auth.currentUser) {
      throw new Error("No authenticated user found.");
    }

    await auth.currentUser.reload();

    // Store a fresh user reference in React state
    setUser(createUserProxy(auth.currentUser));
  };

  // Reset Password
  const resetPassword = (email) => {
    setLoading(true);
    return sendPasswordResetEmail(auth, email);
  };

  // Auth State Observer
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(createUserProxy(currentUser));
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const authInfo = {
    registerUser,
    signInUser,
    signInWithGoogle,
    logout,
    updateUserProfile,
    refreshUser,
    resetPassword,
    user,
    loading,
  };

  return (
    <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
