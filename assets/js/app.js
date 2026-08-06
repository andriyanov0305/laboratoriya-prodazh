"use strict";

const questions = [
  { title: "Где продаётся товар?", hint: "Выберите основную площадку для оценки.", answers: [
    { label: "Wildberries", points: 0, risk: "Wildberries" }, { label: "Ozon", points: 0, risk: "Ozon" }, { label: "На обеих площадках", points: 0, risk: "Wildberries и Ozon" }
  ]},
  { title: "Как давно обновлялся первый слайд?", hint: "Первый экран карточки сильнее всего влияет на первое впечатление.", answers: [
    { label: "Меньше месяца назад", points: 18, risk: "первый слайд" }, { label: "От 1 до 6 месяцев", points: 11, risk: "первый слайд" }, { label: "Больше полугода / не помню", points: 3, risk: "первый слайд" }
  ]},
  { title: "Есть ли чёткое отличие от конкурентов?", hint: "Не общая характеристика, а причина выбрать именно ваш товар.", answers: [
    { label: "Да, подтверждено данными", points: 22, risk: "позиционирование" }, { label: "Сформулировано, но не проверено", points: 12, risk: "позиционирование" }, { label: "Пока нет", points: 2, risk: "позиционирование" }
  ]},
  { title: "Когда вы анализировали лидеров категории?", hint: "Рынок и визуальные стандарты категории меняются.", answers: [
    { label: "В течение последнего месяца", points: 20, risk: "анализ конкурентов" }, { label: "Несколько месяцев назад", points: 10, risk: "анализ конкурентов" }, { label: "Не проводили", points: 0, risk: "анализ конкурентов" }
  ]},
  { title: "На чём основаны тексты и инфографика?", hint: "Сильная карточка опирается на мотивы покупки и доказательства.", answers: [
    { label: "На исследовании покупателей и рынка", points: 22, risk: "аргументы покупки" }, { label: "На характеристиках товара", points: 11, risk: "аргументы покупки" }, { label: "Сделали по примеру конкурентов", points: 3, risk: "аргументы покупки" }
  ]},
  { title: "Как вы оцениваете результат карточки?", hint: "Метрики помогают отличать гипотезы от работающих решений.", answers: [
    { label: "Слежу за CTR, конверсией и продажами", points: 18, risk: "измерение результата" }, { label: "Смотрю только продажи", points: 9, risk: "измерение результата" }, { label: "Регулярно не измеряю", points: 1, risk: "измерение результата" }
  ]}
];

const state = { step: 0, answers: [] };
const quizCard = document.querySelector("#quiz-card");

function escapeHtml(value) {
  return String(value).replace(/[&<>'"]/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[char]);
}

function score() { return Math.min(100, state.answers.reduce((sum, item) => sum + item.points, 0)); }
function scoreLabel(value) { return value >= 78 ? "Сильная база" : value >= 52 ? "Есть заметные точки роста" : "Карточке нужна системная переработка"; }
function risks() { return state.answers.slice(1).map(item => ({ risk: item.risk, points: item.points })).sort((a, b) => a.points - b.points).slice(0, 3).map(item => item.risk); }

function renderQuestion() {
  const question = questions[state.step];
  quizCard.innerHTML = `<div class="quiz-progress"><span>Вопрос ${state.step + 1} из ${questions.length}</span><div><i style="width:${((state.step + 1) / questions.length) * 100}%"></i></div></div><h3>${escapeHtml(question.title)}</h3><p class="question-hint">${escapeHtml(question.hint)}</p><div class="answer-list">${question.answers.map((answer, index) => `<button type="button" data-answer="${index}">${escapeHtml(answer.label)}<span>→</span></button>`).join("")}</div>${state.step > 0 ? '<button class="quiz-back" type="button" data-action="back">← Назад</button>' : ""}`;
}

function renderResult() {
  const value = score();
  quizCard.innerHTML = `<div class="quiz-result"><span class="result-kicker">Автоматический предварительный результат</span><div class="score-line"><strong>${value}</strong><span>/100</span></div><h3>${scoreLabel(value)}</h3><p>В первую очередь стоит проверить:</p><ol>${risks().map((risk, index) => `<li><span>0${index + 1}</span>${escapeHtml(risk)}</li>`).join("")}</ol><div class="quiz-result-note">Результат рассчитан автоматически по вашим ответам. Данные никуда не отправляются. Полный аудит включает исследование карточки и сравнение с рынком.</div><button type="button" class="quiz-back" data-action="restart">Пройти заново</button></div>`;
}

quizCard.addEventListener("click", event => {
  const answerButton = event.target.closest("[data-answer]");
  if (answerButton) {
    state.answers = [...state.answers.slice(0, state.step), questions[state.step].answers[Number(answerButton.dataset.answer)]];
    state.step += 1;
    state.step < questions.length ? renderQuestion() : renderResult();
    return;
  }
  const action = event.target.closest("[data-action]")?.dataset.action;
  if (action === "back") { state.step -= 1; renderQuestion(); }
  if (action === "restart") { state.step = 0; state.answers = []; renderQuestion(); }
});

renderQuestion();
