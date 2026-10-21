// lib/firebase-admin.ts
// Firebase ADMIN SDK - SERVER ONLY.
// The "server-only" import below will cause a build error if any
// client component (a file with "use client" at the top) ever imports
// this module. Prevents accidental private-key leakage to the browser.

import "server-only";

import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      "Missing environment variable: " + name +
      ". Check that .env.local exists and contains this key."
    );
  }
  return value;
}

const existingApps = getApps();

export const adminApp =
  existingApps.length > 0
    ? existingApps[0]
    : initializeApp({
        credential: cert({
          projectId: required("FIREBASE_PROJECT_ID"),
          clientEmail: required("FIREBASE_CLIENT_EMAIL"),
          privateKey: required("FIREBASE_PRIVATE_KEY").replace(/\\n/g, "\n"),
        }),
      });

export const adminAuth = getAuth(adminApp);
export const adminDb = getFirestore(adminApp);
