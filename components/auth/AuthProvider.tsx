"use client";

// components/auth/AuthProvider.tsx
// Global client-side auth state.

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  onAuthStateChanged,
  signOut as firebaseSignOut,
  type User,
} from "firebase/auth";
import { auth } from "@/lib/firebase";

type AuthContextValue = {
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  refreshClaims: () => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue>({
  user: null,
  isAdmin: false,
  loading: true,
  refreshClaims: async () => {},
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const syncedUid = useRef<string | null>(null);

  const syncSession = useCallback(async (firebaseUser: User) => {
    try {
      const idToken = await firebaseUser.getIdToken();
      const res = await fetch("/api/session", {
        method: "POST",
        headers: { Authorization: "Bearer " + idToken },
        credentials: "same-origin",
      });
      if (!res.ok) {
        const body = await res.text();
        if (res.status === 401) {
          console.warn(
            "[AuthProvider] session cookie refresh skipped:",
            res.status,
            body
          );
        } else {
          console.error(
            "[AuthProvider] session sync failed:",
            res.status,
            body
          );
        }
      }
    } catch (err) {
      console.warn("[AuthProvider] session sync network error:", err);
    }
  }, []);

  const refreshClaims = useCallback(async () => {
    const current = auth.currentUser;
    if (!current) {
      setIsAdmin(false);
      return;
    }
    try {
      const tokenResult = await current.getIdTokenResult(true);
      setIsAdmin(tokenResult.claims.admin === true);
    } catch (err) {
      console.error("[AuthProvider] refreshClaims failed:", err);
    }
  }, []);

  const signOut = useCallback(async () => {
    try {
      await fetch("/api/session", {
        method: "DELETE",
        credentials: "same-origin",
      });
    } catch (err) {
      console.error("[AuthProvider] session delete failed:", err);
    }
    await firebaseSignOut(auth);
    syncedUid.current = null;
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);

      if (firebaseUser) {
        if (syncedUid.current !== firebaseUser.uid) {
          await syncSession(firebaseUser);
          syncedUid.current = firebaseUser.uid;
        }
        try {
          const tokenResult = await firebaseUser.getIdTokenResult();
          setIsAdmin(tokenResult.claims.admin === true);
        } catch (err) {
          console.error("[AuthProvider] failed to read claims:", err);
        }
      } else {
        setIsAdmin(false);
        syncedUid.current = null;
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, [syncSession]);

  return (
    <AuthContext.Provider
      value={{ user, isAdmin, loading, refreshClaims, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
