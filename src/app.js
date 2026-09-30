import {
  auth,
  db,
  storage
} from "./firebase-init.js";

import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";

import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

console.log("Capoeira Performance v1.0.1");
console.log("Firebase conectado:", db);

const addExerciseBtn = document.getElementById("addExerciseBtn");
const exerciseList = document.getElementById("exerciseList");

const exerciseImages = {
  "agachamento": "assets/squat-capoeira.png",
  "agachamento livre": "assets/squat-capoeira.png",
  "levantamento terra": "assets/deadlift-capoeira.png",
  "box jump": "assets/jump-capoeira.png",
  "salto": "assets/jump-capoeira.png",
  "mobilidade de quadril": "assets/mobility-capoeira.png"
};

function getExerciseImage(name) {
  const normalized = name.trim().toLowerCase();
  return exerciseImages[normalized] || "assets/default-exercise.png";
}

function createExerciseCard({ name, category, series, reps, load }) {
  const img = getExerciseImage(name);

  const article = document.createElement("article");
  article.className = "exercise-card";

  article.innerHTML = `
    <div class="exercise-media">
      <img src="${img}" alt="Capoeirista executando ${name}" />
    </div>
    <div class="exercise-info">
      <div class="exercise-top">
        <span class="exercise-tag">${category}</span>
        <span class="exercise-status">Pendente</span>
      </div>
      <h4>${name}</h4>
      <p>${series} séries • ${reps} repetições • ${load > 0 ? load + " kg" : "Peso corporal"}</p>
      <div class="exercise-actions">
        <button class="btn btn-secondary btn-small complete-btn">Concluir</button>
        <button class="btn btn-danger btn-small remove-btn">Remover</button>
      </div>
    </div>
  `;

  article.querySelector(".remove-btn").addEventListener("click", () => {
    article.remove();
  });

  article.querySelector(".complete-btn").addEventListener("click", () => {
    const status = article.querySelector(".exercise-status");
    status.textContent = "Concluído";
    status.style.background = "rgba(34,197,94,0.12)";
    status.style.color = "#80f0aa";
  });

  exerciseList.appendChild(article);
}

addExerciseBtn?.addEventListener("click", () => {
  const name = document.getElementById("exerciseName").value;
  const category = document.getElementById("exerciseCategory").value;
  const series = document.getElementById("series").value;
  const reps = document.getElementById("reps").value;
  const load = document.getElementById("load").value;

  if (!name.trim()) {
    alert("Digite o nome do exercício.");
    return;
  }

  createExerciseCard({ name, category, series, reps, load });

  document.getElementById("exerciseName").value = "";
  document.getElementById("series").value = 3;
  document.getElementById("reps").value = 8;
  document.getElementById("load").value = 0;
});