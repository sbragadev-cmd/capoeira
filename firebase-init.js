// ======================================================
// CAPOEIRA PERFORMANCE
// Firebase Init
// Versão do app: 1.0.1
// Firebase SDK: 10.14.1
// ======================================================

import { initializeApp } from
  "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";

import {
  getAnalytics,
  isSupported
} from
  "https://www.gstatic.com/firebasejs/10.14.1/firebase-analytics.js";

import {
  getAuth,
  setPersistence,
  browserLocalPersistence
} from
  "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";

import {
  getFirestore
} from
  "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

import {
  getStorage
} from
  "https://www.gstatic.com/firebasejs/10.14.1/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyAImXT9gH6GqhW9hs2vwqi2zdjhwf3xdUc",
  authDomain: "treinocapoeira-74151.firebaseapp.com",
  projectId: "treinocapoeira-74151",
  storageBucket: "treinocapoeira-74151.firebasestorage.app",
  messagingSenderId: "190928927324",
  appId: "1:190928927324:web:7241fdf2676d8dab8b8499",
  measurementId: "G-BZJP0E9RKW"
};

// ======================================================
// Inicialização
// ======================================================

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

setPersistence(auth, browserLocalPersistence)
  .catch((error) => {
    console.error(
      "[Capoeira Performance] Erro na persistência de autenticação:",
      error
    );
  });

const db = getFirestore(app);

const storage = getStorage(app);

// Analytics é opcional.
// Evita erro em navegador/ambiente que não oferece suporte.
let analytics = null;

isSupported()
  .then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  })
  .catch((error) => {
    console.warn(
      "[Capoeira Performance] Analytics indisponível:",
      error
    );
  });

export {
  app,
  auth,
  db,
  storage,
  analytics
};