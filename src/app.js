(() => {
  'use strict';

  const KEYS = {
    workout: 'cp.v1.workout',
    nutrition: 'cp.v1.nutrition',
    goals: 'cp.v1.goals',
    weight: 'cp.v1.weight'
  };

  const defaultWorkout = [
    { id: 'ex-1', name: 'Agachamento livre', group: 'Força', sets: 4, reps: 5, load: 60, done: false },
    { id: 'ex-2', name: 'Bulgarian split squat', group: 'Força unilateral', sets: 3, reps: 8, load: 16, done: false },
    { id: 'ex-3', name: 'Box jump', group: 'Potência', sets: 4, reps: 5, load: 0, done: false },
    { id: 'ex-4', name: 'Prancha lateral', group: 'Core', sets: 3, reps: 30, load: 0, done: false }
  ];

  const defaultNutrition = {
    calories: 1840,
    caloriesTarget: 2500,
    protein: 124,
    proteinTarget: 160,
    water: 2.1,
    waterTarget: 3
  };

  const defaultGoals = [
    { id: 'g-1', title: 'Treinar 4x na semana', current: 3, target: 4, unit: 'treinos' },
    { id: 'g-2', title: 'Agachamento', current: 80, target: 100, unit: 'kg' },
    { id: 'g-3', title: 'Bananeira', current: 12, target: 30, unit: 's' }
  ];

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function load(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : clone(fallback);
    } catch {
      return clone(fallback);
    }
  }

  function save(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  function uid(prefix) {
    return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }

  function clampNumber(value, min, max, fallback) {
    const n = Number(value);
    if (!Number.isFinite(n)) return fallback;
    return Math.min(max, Math.max(min, n));
  }

  function percent(current, target) {
    if (!target || target <= 0) return 0;
    return Math.round(Math.max(0, Math.min(100, (current / target) * 100)));
  }

  const state = {
    workout: load(KEYS.workout, defaultWorkout),
    nutrition: load(KEYS.nutrition, defaultNutrition),
    goals: load(KEYS.goals, defaultGoals),
    weight: load(KEYS.weight, 82)
  };

  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => [...document.querySelectorAll(selector)];
  let toastTimer;

  function toast(message) {
    const node = $('#toast');
    node.textContent = message;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { node.textContent = ''; }, 2600);
  }

  function setView(view) {
    $$('.view').forEach((section) => section.classList.toggle('active', section.dataset.view === view));
    $$('.bottom-nav button').forEach((button) => button.classList.toggle('active', button.dataset.go === view));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function renderVersion() {
    $('#appVersion').textContent = `v${window.APP_VERSION || '1.0.0'}`;
  }

  function renderHome() {
    const total = state.workout.length;
    const completed = state.workout.filter((item) => item.done).length;
    const p = percent(completed, total);
    $('#heroProgressText').textContent = `${completed} de ${total} exercícios concluídos`;
    $('#workoutPercent').textContent = `${p}%`;
    $('#workoutRing').style.setProperty('--p', `${p * 3.6}deg`);
    $('#weightInput').value = state.weight;
    $('#weightValue').textContent = `${Number(state.weight).toFixed(1).replace('.', ',')} kg`;

    const n = state.nutrition;
    $('#homeCalories').textContent = `${n.calories} / ${n.caloriesTarget} kcal`;
    $('#homeProtein').textContent = `${n.protein} / ${n.proteinTarget} g`;
    $('#homeCaloriesBar').style.width = `${percent(n.calories, n.caloriesTarget)}%`;
    $('#homeProteinBar').style.width = `${percent(n.protein, n.proteinTarget)}%`;
  }

  function renderWorkout() {
    const list = $('#exerciseList');
    list.replaceChildren();

    state.workout.forEach((item) => {
      const article = document.createElement('article');
      article.className = `exercise card${item.done ? ' done' : ''}`;
      article.dataset.id = item.id;

      const check = document.createElement('button');
      check.className = 'check';
      check.type = 'button';
      check.textContent = item.done ? '✓' : '';
      check.setAttribute('aria-label', item.done ? 'Marcar como pendente' : 'Marcar como concluído');
      check.addEventListener('click', () => {
        item.done = !item.done;
        save(KEYS.workout, state.workout);
        renderAll();
      });

      const body = document.createElement('div');
      body.className = 'exercise-body';
      body.innerHTML = `<div><strong></strong><span></span></div><div class="exercise-inputs"></div>`;
      body.querySelector('strong').textContent = item.name;
      body.querySelector('span').textContent = item.group;

      const inputGrid = body.querySelector('.exercise-inputs');
      [
        ['Séries', 'sets', 1, 20, 1],
        ['Reps', 'reps', 1, 200, 1],
        ['Carga', 'load', 0, 500, 0.5]
      ].forEach(([labelText, field, min, max, step]) => {
        const label = document.createElement('label');
        label.textContent = labelText;
        const input = document.createElement('input');
        input.type = 'number';
        input.min = String(min);
        input.max = String(max);
        input.step = String(step);
        input.value = item[field];
        input.addEventListener('change', () => {
          item[field] = clampNumber(input.value, min, max, item[field]);
          save(KEYS.workout, state.workout);
          input.value = item[field];
        });
        label.appendChild(input);
        inputGrid.appendChild(label);
      });

      const remove = document.createElement('button');
      remove.className = 'danger';
      remove.type = 'button';
      remove.textContent = '×';
      remove.setAttribute('aria-label', `Excluir ${item.name}`);
      remove.addEventListener('click', () => {
        state.workout = state.workout.filter((exercise) => exercise.id !== item.id);
        save(KEYS.workout, state.workout);
        renderAll();
        toast('Exercício removido.');
      });

      article.append(check, body, remove);
      list.appendChild(article);
    });

    const completed = state.workout.filter((item) => item.done).length;
    $('#trainingBar').style.width = `${percent(completed, state.workout.length)}%`;
  }

  function renderNutrition() {
    const n = state.nutrition;
    ['calories', 'caloriesTarget', 'protein', 'proteinTarget', 'water', 'waterTarget'].forEach((key) => {
      $(`#${key}`).value = n[key];
    });

    $('#caloriesSummary').textContent = `${n.calories} / ${n.caloriesTarget} kcal`;
    $('#proteinSummary').textContent = `${n.protein} / ${n.proteinTarget} g`;
    $('#waterSummary').textContent = `${n.water} / ${n.waterTarget} L`;
    $('#caloriesBar').style.width = `${percent(n.calories, n.caloriesTarget)}%`;
    $('#proteinBar').style.width = `${percent(n.protein, n.proteinTarget)}%`;
    $('#waterBar').style.width = `${percent(n.water, n.waterTarget)}%`;
  }

  function renderGoals() {
    const list = $('#goalList');
    list.replaceChildren();

    state.goals.forEach((goal) => {
      const card = document.createElement('article');
      card.className = 'card goal-card';
      card.innerHTML = `
        <div><strong></strong><span></span></div>
        <div class="progress"><span></span></div>
        <button class="ghost" type="button">+1 progresso</button>
      `;
      card.querySelector('strong').textContent = goal.title;
      card.querySelector('div > span').textContent = `${goal.current} / ${goal.target} ${goal.unit}`;
      card.querySelector('.progress span').style.width = `${percent(goal.current, goal.target)}%`;
      const button = card.querySelector('button');
      button.disabled = goal.current >= goal.target;
      button.addEventListener('click', () => {
        goal.current = Math.min(goal.target, Number(goal.current) + 1);
        save(KEYS.goals, state.goals);
        renderGoals();
        toast('Progresso atualizado.');
      });
      list.appendChild(card);
    });
  }

  function renderAll() {
    renderHome();
    renderWorkout();
    renderNutrition();
    renderGoals();
  }

  $$('.bottom-nav button, [data-go]').forEach((button) => {
    button.addEventListener('click', () => setView(button.dataset.go));
  });

  $('#weightInput').addEventListener('change', (event) => {
    state.weight = clampNumber(event.target.value, 20, 300, state.weight);
    save(KEYS.weight, state.weight);
    renderHome();
    toast('Peso atualizado.');
  });

  $('#exerciseForm').addEventListener('submit', (event) => {
    event.preventDefault();
    const name = $('#exerciseName').value.trim();
    if (!name) {
      toast('Informe o nome do exercício.');
      return;
    }
    state.workout.push({
      id: uid('ex'),
      name,
      group: $('#exerciseGroup').value,
      sets: clampNumber($('#exerciseSets').value, 1, 20, 3),
      reps: clampNumber($('#exerciseReps').value, 1, 200, 8),
      load: clampNumber($('#exerciseLoad').value, 0, 500, 0),
      done: false
    });
    save(KEYS.workout, state.workout);
    event.target.reset();
    $('#exerciseSets').value = 3;
    $('#exerciseReps').value = 8;
    $('#exerciseLoad').value = 0;
    renderAll();
    toast('Exercício adicionado.');
  });

  $('#resetWorkout').addEventListener('click', () => {
    state.workout.forEach((item) => { item.done = false; });
    save(KEYS.workout, state.workout);
    renderAll();
    toast('Treino reiniciado.');
  });

  $('#nutritionForm').addEventListener('submit', (event) => {
    event.preventDefault();
    state.nutrition = {
      calories: clampNumber($('#calories').value, 0, 10000, 0),
      caloriesTarget: clampNumber($('#caloriesTarget').value, 1, 10000, 2500),
      protein: clampNumber($('#protein').value, 0, 1000, 0),
      proteinTarget: clampNumber($('#proteinTarget').value, 1, 1000, 160),
      water: clampNumber($('#water').value, 0, 20, 0),
      waterTarget: clampNumber($('#waterTarget').value, 0.1, 20, 3)
    };
    save(KEYS.nutrition, state.nutrition);
    renderAll();
    toast('Alimentação salva.');
  });

  renderVersion();
  renderAll();

  if ('serviceWorker' in navigator && location.protocol !== 'file:') {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js').catch((error) => {
        console.error('Falha ao registrar Service Worker:', error);
      });
    });
  }
})();
