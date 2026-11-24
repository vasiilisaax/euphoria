/* ============================================================
   EUPHORIA — интерактив лендинга (ванильный JS, без библиотек)
   ============================================================ */
'use strict';

document.documentElement.classList.add('js');

const $  = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ------------------------------------------------------------
   0. Данные
------------------------------------------------------------ */
const VK_EMBED_SRC = 'https://vk.com/video_ext.php?oid=-53921002&id=456241281&hd=2&autoplay=1';

const ACTORS = {
  zendaya: {
    name: 'Зендея', role: 'Ру Беннетт',
    bio: 'Американская актриса, певица, танцовщица и модель. Полное имя — Зендея Мари Штёрмер Коулман. Родилась 1 сентября 1996 года в Окленде (Калифорния, США). Двукратная обладательница премии «Эмми» как лучшая актриса драматического сериала — обе награды принесла роль Ру.'
  },
  hunter: {
    name: 'Хантер Шафер', role: 'Джулс Вон',
    bio: 'Американская актриса, модель, художница и активистка. Родилась 31 декабря 1998 года в Трентоне (Нью-Джерси, США). Роль Джулс в «Эйфории» стала её актёрским дебютом.'
  },
  jacob: {
    name: 'Джейкоб Элорди', role: 'Нэйт Джейкобс',
    bio: 'Австралийский актёр. Получил широкую известность после выхода сериала «Эйфория». Номинант на премию «Оскар» 2026 года в категории «Лучшая мужская роль второго плана» за работу в фильме «Франкенштейн» Гильермо дель Торо.'
  },
  alexa: {
    name: 'Алекса Деми', role: 'Мэдди Перес',
    bio: 'Американская актриса и певица, наиболее известная по роли Мэдди Перес в сериале HBO «Эйфория» (2019–2026).'
  },
  barbie: {
    name: 'Барби Феррейра', role: 'Кэт Эрнандес',
    bio: 'Американская актриса и модель. Родилась 14 декабря 1996 года в Нью-Йорке, имеет бразильское происхождение.'
  },
  sydney: {
    name: 'Сидни Суини', role: 'Кэсси Говард',
    bio: 'Американская актриса кино и телевидения, а также продюсер. Получила широкую известность благодаря ролям в сериалах «Эйфория», «Белый лотос», «Рассказ служанки», мини-сериале «Острые предметы» и фильме Квентина Тарантино «Однажды в Голливуде».'
  },
  javon: {
    name: 'Джейвон Уолтон', role: 'Эштрей',
    bio: 'Американский актёр и спортсмен-боксёр. Родился 22 июля 2006 года в Атланте (штат Джорджия, США). В «Эйфории» сыграл Эштрея — младшего напарника Феско.'
  },
  angus: {
    name: 'Ангус Клауд', role: 'Феско',
    bio: 'Американский актёр, наиболее известный по роли Феско (Феса) в телесериале HBO «Эйфория» (2019–2022).'
  }
};

/* Персонажи квиза: палитра, черты, манифест */
const CHARS = {
  rue:   { name: 'Ру',    actor: 'Зендея',        a: '#8b5cf6', b: '#c4b5fd',
           traits: ['наблюдатель', 'хаос', 'нежность'],
           strength: 'видишь людей насквозь', shadow: 'прячешься от себя',
           manifest: 'Ты чувствуешь всё сразу и слишком громко — и учишься делать тишину внутри.' },
  jules: { name: 'Джулс', actor: 'Хантер Шафер',  a: '#f472b6', b: '#f9a8d4',
           traits: ['свобода', 'свет', 'поиск'],
           strength: 'меняешь пространство вокруг', shadow: 'убегаешь, когда становится близко',
           manifest: 'Ты — цвет, который появляется в чужой чёрно-белой комнате.' },
  maddy: { name: 'Мэдди', actor: 'Алекса Деми',   a: '#d946ef', b: '#a21caf',
           traits: ['огонь', 'стиль', 'гордость'],
           strength: 'держишь удар и планку', shadow: 'путаешь любовь и войну',
           manifest: 'Ты входишь в комнату — и комната запоминает, кто здесь главная.' },
  cassie:{ name: 'Кэсси', actor: 'Сидни Суини',   a: '#38bdf8', b: '#0ea5e9',
           traits: ['тепло', 'верность', 'ранимость'],
           strength: 'любишь без запаса', shadow: 'растворяешься в других',
           manifest: 'Ты отдаёшь себя целиком и ждёшь, что кто-то заметит цену.' },
  fez:   { name: 'Фес',   actor: 'Ангус Клауд',   a: '#f59e0b', b: '#b45309',
           traits: ['спокойствие', 'забота', 'улица'],
           strength: 'надёжный, как ночь', shadow: 'молчишь, когда надо сказать',
           manifest: 'Ты — тот, кто остаётся, когда все остальные уже ушли.' },
  lexi:  { name: 'Лекси', actor: 'Мод Апатоу',    a: '#a3e635', b: '#65a30d',
           traits: ['ум', 'ирония', 'наблюдение'],
           strength: 'замечаешь то, что все пропустили', shadow: 'живёшь в чужих сюжетах',
           manifest: 'Ты пишешь сценарий жизни, пока другие импровизируют на сцене.' }
};

const QUESTIONS = [
  { q: 'Пятница, 23:47. Где ты?', opts: [
    { t: 'На крыше с одним человеком и честным разговором', w: { rue: 2, jules: 1 } },
    { t: 'В центре вечеринки, все смотрят на меня',        w: { maddy: 2, cassie: 1 } },
    { t: 'У друга на кухне, помогаю разрулить чужой кризис', w: { fez: 2, lexi: 1 } },
    { t: 'В ванной, репетирую, что скажу ему или ей',       w: { cassie: 2, lexi: 1 } } ] },
  { q: 'Твой стиль — это…', opts: [
    { t: 'оверсайз, худи, ничего лишнего',                 w: { rue: 2, fez: 1 } },
    { t: 'неон, стразы, макияж как искусство',             w: { jules: 2, maddy: 1 } },
    { t: 'безупречный образ, даже если внутри буря',       w: { maddy: 2, cassie: 1 } },
    { t: 'винтаж и ирония, будто из чужого кино',          w: { lexi: 2, jules: 1 } } ] },
  { q: 'Друг совершил ошибку. Ты…', opts: [
    { t: 'молча рядом, без нотаций',                       w: { fez: 2, rue: 1 } },
    { t: 'скажу правду в лицо, даже если больно',          w: { maddy: 2, lexi: 1 } },
    { t: 'прикрою перед всеми, разберёмся потом',          w: { cassie: 2, fez: 1 } },
    { t: 'превращу это в историю, которую расскажу через год', w: { lexi: 2, jules: 1 } } ] },
  { q: 'Что тебя пугает больше?', opts: [
    { t: 'остаться наедине с собой',                       w: { rue: 2, cassie: 1 } },
    { t: 'стать обычной, как все',                         w: { jules: 2, maddy: 1 } },
    { t: 'что меня любят не по-настоящему',                w: { cassie: 2, maddy: 1 } },
    { t: 'что моя жизнь — черновик чужого сюжета',         w: { lexi: 2, rue: 1 } } ] },
  { q: 'Твоя суперсила на вечеринке:', opts: [
    { t: 'вижу, кому плохо, раньше всех',                  w: { rue: 2, fez: 1 } },
    { t: 'превращаю скучный вечер в событие',              w: { jules: 2, maddy: 1 } },
    { t: 'держу всё под контролем, даже чужие тайны',      w: { maddy: 2, lexi: 1 } },
    { t: 'делаю так, что каждому тепло',                   w: { cassie: 2, fez: 1 } } ] },
  { q: 'Что ты оставишь после себя?', opts: [
    { t: 'тихую правду, которую кто-то услышит',           w: { rue: 2, lexi: 1 } },
    { t: 'вспышку, которую будут вспоминать',              w: { jules: 2, maddy: 1 } },
    { t: 'людей, которых я защитил(а)',                    w: { fez: 2, cassie: 1 } },
    { t: 'сценарий, где все наконец поняли себя',          w: { lexi: 2, jules: 1 } } ] }
];

const AUDIENCE = [
  { key: 'rue', pct: 24 }, { key: 'jules', pct: 21 }, { key: 'maddy', pct: 18 },
  { key: 'cassie', pct: 15 }, { key: 'fez', pct: 12 }, { key: 'lexi', pct: 10 }
];

/* ------------------------------------------------------------
   1. Тост
------------------------------------------------------------ */
const toastEl = $('#toast');
let toastTimer = null;
function showToast(message) {
  toastEl.textContent = message;
  toastEl.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toastEl.classList.remove('show'), 2600);
}

/* ------------------------------------------------------------
   2. Защита картинок
------------------------------------------------------------ */
function makePlaceholder(w, h, label = 'CINEMA') {
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">` +
    `<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">` +
    `<stop offset="0" stop-color="#2a1650"/><stop offset="1" stop-color="#0b0714"/>` +
    `</linearGradient></defs>` +
    `<rect width="${w}" height="${h}" fill="url(#g)"/>` +
    `<g fill="none" stroke="#a78bfa" stroke-opacity=".55" stroke-width="5">` +
    `<rect x="${w / 2 - 70}" y="${h / 2 - 62}" width="140" height="104" rx="12"/>` +
    `<circle cx="${w / 2}" cy="${h / 2 - 10}" r="26"/>` +
    `</g>` +
    `<text x="${w / 2}" y="${h / 2 + 84}" fill="#a78bfa" opacity=".85" ` +
    `font-family="Georgia, serif" font-size="26" letter-spacing="6" text-anchor="middle">${label}</text>` +
    `</svg>`;
  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
}
function guardImage(img) {
  const onError = () => {
    if (img.dataset.fbStep === 'final') return;
    if (img.dataset.fallback && img.dataset.fbStep !== 'alt') {
      img.dataset.fbStep = 'alt'; img.src = img.dataset.fallback;
    } else {
      img.dataset.fbStep = 'final';
      img.src = img.closest('.story-media')
        ? makePlaceholder(1500, 900)
        : makePlaceholder(600, 800, img.dataset.ph || 'CINEMA');
    }
  };
  img.addEventListener('error', onError);
  if (img.complete && img.naturalWidth === 0 && img.getAttribute('src')) onError();
}
$$('img').forEach(guardImage);

const heroBg = $('.hero-bg');
if (heroBg) {
  const match = getComputedStyle(heroBg).backgroundImage.match(/url\(["']?([^"')]+)["']?\)/);
  if (match) {
    const probe = new Image();
    probe.onerror = () => heroBg.classList.add('no-image');
    probe.src = match[1];
  } else heroBg.classList.add('no-image');
}

/* ------------------------------------------------------------
   3. Шапка
------------------------------------------------------------ */
const header = $('.site-header');
const burger = $('#burger');
const mainNav = $('#main-nav');
const navLinks = $$('.nav-link');

window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 10);
}, { passive: true });

function closeMenu() {
  mainNav.classList.remove('open');
  burger.classList.remove('open');
  burger.setAttribute('aria-expanded', 'false');
}
burger.addEventListener('click', () => {
  const open = mainNav.classList.toggle('open');
  burger.classList.toggle('open', open);
  burger.setAttribute('aria-expanded', String(open));
});
navLinks.forEach(link => link.addEventListener('click', closeMenu));

const spy = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    navLinks.forEach(link =>
      link.classList.toggle('is-active', link.getAttribute('href') === '#' + entry.target.id));
  });
}, { rootMargin: '-40% 0px -55% 0px' });
['hero', 'cast', 'story', 'quiz'].forEach(id => {
  const sec = document.getElementById(id);
  if (sec) spy.observe(sec);
});

/* ------------------------------------------------------------
   4. Свайпы
------------------------------------------------------------ */
let lastSwipeAt = 0;
const justSwiped = () => Date.now() - lastSwipeAt < 400;
function addSwipe(el, onLeft, onRight) {
  let startX = null, startY = null;
  el.addEventListener('pointerdown', e => { startX = e.clientX; startY = e.clientY; });
  el.addEventListener('pointerup', e => {
    if (startX === null) return;
    const dx = e.clientX - startX, dy = e.clientY - startY;
    startX = startY = null;
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) {
      lastSwipeAt = Date.now();
      (dx < 0 ? onLeft : onRight)();
    }
  });
  el.addEventListener('pointercancel', () => { startX = startY = null; });
}

/* ------------------------------------------------------------
   5. Карусель актёров
------------------------------------------------------------ */
const castViewport = $('#cast-viewport');
const castTrack    = $('#cast-track');
const castCards    = $$('.cast-card', castTrack);
const castDotsWrap = $('#cast-dots');
let castIndex = 0, perView = 4, castMax = 0;

function calcPerView() {
  const w = window.innerWidth;
  return w >= 1024 ? 4 : w >= 640 ? 2 : 1;
}
function renderCast(animate = true) {
  if (!animate) castTrack.style.transition = 'none';
  castTrack.style.transform = `translateX(-${castIndex * (100 / perView)}%)`;
  $$('.dot', castDotsWrap).forEach((dot, i) => {
    dot.classList.toggle('is-active', i === castIndex);
    if (i === castIndex) dot.setAttribute('aria-current', 'true');
    else dot.removeAttribute('aria-current');
  });
  if (!animate) { void castTrack.offsetWidth; castTrack.style.transition = ''; }
}
function buildCastDots() {
  castDotsWrap.innerHTML = '';
  for (let i = 0; i <= castMax; i++) {
    const dot = document.createElement('button');
    dot.type = 'button'; dot.className = 'dot';
    dot.setAttribute('aria-label', `Актёры: позиция ${i + 1} из ${castMax + 1}`);
    dot.addEventListener('click', () => { castIndex = i; renderCast(); });
    castDotsWrap.appendChild(dot);
  }
}
function layoutCast() {
  perView = calcPerView();
  castViewport.style.setProperty('--per-view', perView);
  castMax = Math.max(0, castCards.length - perView);
  castIndex = Math.min(castIndex, castMax);
  buildCastDots(); renderCast(false);
}
function stepCast(dir) {
  castIndex += dir;
  if (castIndex < 0) castIndex = castMax;
  if (castIndex > castMax) castIndex = 0;
  renderCast();
}
$('#cast-prev').addEventListener('click', () => stepCast(-1));
$('#cast-next').addEventListener('click', () => stepCast(1));
castViewport.addEventListener('keydown', e => {
  if (e.key === 'ArrowLeft')  { e.preventDefault(); stepCast(-1); }
  if (e.key === 'ArrowRight') { e.preventDefault(); stepCast(1); }
});
addSwipe(castViewport, () => stepCast(1), () => stepCast(-1));
layoutCast();

$$('.cast-open').forEach(btn => {
  btn.addEventListener('click', () => {
    if (justSwiped()) return;
    openActor(btn.dataset.actor, $('img', btn.closest('.cast-card')));
  });
});

/* ------------------------------------------------------------
   6. Сюжет
------------------------------------------------------------ */
const storyBlocks  = $$('.story-block');
const chapterChips = $$('.chapter-chip');
if ('IntersectionObserver' in window) {
  const storyObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => entry.target.classList.toggle('in-view', entry.isIntersecting));
  }, { threshold: .25 });
  storyBlocks.forEach(b => storyObserver.observe(b));
  const chapterSpy = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      chapterChips.forEach(chip =>
        chip.classList.toggle('is-active', chip.getAttribute('href') === '#' + entry.target.id));
    });
  }, { rootMargin: '-45% 0px -45% 0px' });
  storyBlocks.forEach(b => chapterSpy.observe(b));
} else storyBlocks.forEach(b => b.classList.add('in-view'));

const julesToggle = $('#jules-toggle');
if (julesToggle) {
  julesToggle.addEventListener('click', () => {
    const on = julesToggle.classList.toggle('is-color');
    julesToggle.setAttribute('aria-pressed', String(on));
  });
}

/* ------------------------------------------------------------
   7. КВИЗ
------------------------------------------------------------ */
const quizBoard   = $('#quiz-board');
const quizStep    = $('#quiz-step');
const quizResult  = $('#quiz-result');
const quizBar     = $('#quiz-bar');
const quizCount   = $('#quiz-count');
const quizQuestion= $('#quiz-question');
const quizOptions = $('#quiz-options');
const quizBack    = $('#quiz-back');
const quizLive    = $('#quiz-live');
let answers = [];
let qIndex = 0;
let lastResult = null;
let advanceTimer = null;

function scoresFrom(list) {
  const s = {};
  Object.keys(CHARS).forEach(k => s[k] = 0);
  list.forEach((optIdx, i) => {
    const w = QUESTIONS[i].opts[optIdx].w;
    Object.entries(w).forEach(([k, v]) => s[k] += v);
  });
  return s;
}
function maxPossible(key) {
  return QUESTIONS.reduce((sum, q) => {
    const vals = q.opts.map(o => o.w[key] || 0);
    return sum + Math.max(...vals);
  }, 0);
}
function setPalette(a, b) {
  quizBoard.style.setProperty('--qa', a);
  quizBoard.style.setProperty('--qb', b);
}
function livePalette() {
  const s = scoresFrom(answers.slice(0, qIndex));
  const top = Object.entries(s).sort((x, y) => y[1] - x[1])[0];
  if (top && top[1] > 0) setPalette(CHARS[top[0]].a, CHARS[top[0]].b);
  else setPalette('#8b5cf6', '#f472b6');
}

function renderQuestion() {
  clearTimeout(advanceTimer);
  quizResult.hidden = true;
  quizStep.hidden = false;
  const q = QUESTIONS[qIndex];
  quizCount.textContent = `Вопрос ${qIndex + 1} / ${QUESTIONS.length}`;
  quizQuestion.textContent = q.q;
  quizBar.style.width = `${(answers.length / QUESTIONS.length) * 100}%`;
  quizBack.disabled = qIndex === 0;
  quizOptions.innerHTML = '';
  q.opts.forEach((opt, i) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'quiz-option' + (answers[qIndex] === i ? ' picked' : '');
    b.textContent = opt.t;
    b.addEventListener('click', () => pickOption(i, b));
    quizOptions.appendChild(b);
  });
  livePalette();
  quizLive.textContent = `Вопрос ${qIndex + 1}: ${q.q}`;
  quizQuestion.focus({ preventScroll: true });
}

function pickOption(i, btn) {
  answers[qIndex] = i;
  answers.length = qIndex + 1;
  $$('.quiz-option', quizOptions).forEach(o => o.classList.remove('picked'));
  btn.classList.add('picked');
  quizBar.style.width = `${(answers.length / QUESTIONS.length) * 100}%`;
  livePalette();
  clearTimeout(advanceTimer);
  advanceTimer = setTimeout(() => {
    qIndex += 1;
    if (qIndex >= QUESTIONS.length) showResult();
    else renderQuestion();
  }, reducedMotion ? 60 : 420);
}

quizBack.addEventListener('click', () => {
  if (qIndex === 0) return;
  qIndex -= 1;
  renderQuestion();
});

function burst(colors) {
  const wrap = $('#result-burst');
  wrap.innerHTML = '';
  if (reducedMotion) return;
  for (let i = 0; i < 26; i++) {
    const c = document.createElement('span');
    c.className = 'confetti';
    c.style.left = `${Math.random() * 100}%`;
    c.style.background = colors[i % colors.length];
    c.style.animationDelay = `${Math.random() * .4}s`;
    c.style.transform = `rotate(${Math.random() * 360}deg)`;
    wrap.appendChild(c);
  }
  setTimeout(() => { wrap.innerHTML = ''; }, 2200);
}

function showResult() {
  const s = scoresFrom(answers);
  const sorted = Object.entries(s).sort((x, y) => y[1] - x[1]);
  const topKey = sorted[0][0];
  const ch = CHARS[topKey];
  const pct = Math.min(97, Math.round((sorted[0][1] / maxPossible(topKey)) * 100));
  lastResult = { key: topKey, ch, pct, runner: CHARS[sorted[1][0]] };

  setPalette(ch.a, ch.b);
  quizStep.hidden = true;
  quizResult.hidden = false;
  quizBar.style.width = '100%';

  $('#result-name').textContent = ch.name;
  $('#result-actor').textContent = `${ch.actor} · ${topKey === 'rue' ? 'Ру Беннетт' : ''}`.trim();
  $('#result-actor').textContent = `в исполнении: ${ch.actor}`;
  $('#result-pct').textContent = `${pct}%`;
  $('#result-manifest').textContent = ch.manifest;
  $('#result-strength').textContent = ch.strength;
  $('#result-shadow').textContent = ch.shadow;

  const traits = $('#result-traits');
  traits.innerHTML = '';
  ch.traits.forEach(t => {
    const chip = document.createElement('span');
    chip.className = 'trait-chip';
    chip.textContent = t;
    traits.appendChild(chip);
  });

  const rows = $('#chart-rows');
  rows.innerHTML = '';
  AUDIENCE.forEach(item => {
    const c = CHARS[item.key];
    const row = document.createElement('div');
    row.className = 'chart-row' + (item.key === topKey ? ' me' : '');
    row.innerHTML =
      `<span class="chart-name">${c.name}</span>` +
      `<span class="chart-track"><span class="chart-fill"></span></span>` +
      `<span class="chart-val">${item.pct}%</span>`;
    const fill = $('.chart-fill', row);
    fill.style.background =
      `repeating-linear-gradient(45deg, rgba(255,255,255,.2) 0 5px, transparent 5px 10px), linear-gradient(90deg, ${c.a}, ${c.b})`;
    rows.appendChild(row);
    requestAnimationFrame(() => requestAnimationFrame(() => { fill.style.width = `${item.pct}%`; }));
  });

  burst([ch.a, ch.b, '#ffffff']);
  quizLive.textContent = `Твой персонаж: ${ch.name}, совпадение ${pct} процентов.`;
  $('#result-name').focus({ preventScroll: true });
}

$('#quiz-restart').addEventListener('click', () => {
  answers = []; qIndex = 0; lastResult = null;
  setPalette('#8b5cf6', '#f472b6');
  renderQuestion();
});

$('#quiz-copy').addEventListener('click', async () => {
  if (!lastResult) return;
  const { ch, pct } = lastResult;
  const text = `Я — ${ch.name} из «Эйфории» (${pct}% совпадение). ${ch.manifest} Пройди квиз «Твоя эйфория»!`;
  try {
    await navigator.clipboard.writeText(text);
    showToast('Результат скопирован — делись в сторис ✨');
  } catch {
    const ta = document.createElement('textarea');
    ta.value = text; document.body.appendChild(ta);
    ta.select(); document.execCommand('copy'); ta.remove();
    showToast('Результат скопирован ✨');
  }
});

/* Открытка PNG */
function wrapText(ctx, text, x, y, maxW, lineH) {
  const words = text.split(' ');
  let line = '';
  for (const w of words) {
    const test = line ? line + ' ' + w : w;
    if (ctx.measureText(test).width > maxW && line) {
      ctx.fillText(line, x, y); line = w; y += lineH;
    } else line = test;
  }
  if (line) ctx.fillText(line, x, y);
  return y;
}
$('#quiz-save').addEventListener('click', () => {
  if (!lastResult) return;
  const { ch, pct } = lastResult;
  try {
    const W = 1080, H = 1350;
    const cv = document.createElement('canvas');
    cv.width = W; cv.height = H;
    const ctx = cv.getContext('2d');
    const bg = ctx.createLinearGradient(0, 0, W, H);
    bg.addColorStop(0, '#170f2b'); bg.addColorStop(1, '#0c0817');
    ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
    const glow = ctx.createRadialGradient(W * .2, 0, 0, W * .2, 0, W * .9);
    glow.addColorStop(0, ch.a + '55'); glow.addColorStop(1, 'transparent');
    ctx.fillStyle = glow; ctx.fillRect(0, 0, W, H);
    const glow2 = ctx.createRadialGradient(W, H, 0, W, H, W * .8);
    glow2.addColorStop(0, ch.b + '44'); glow2.addColorStop(1, 'transparent');
    ctx.fillStyle = glow2; ctx.fillRect(0, 0, W, H);
    for (let i = 0; i < 900; i++) {
      ctx.fillStyle = `rgba(255,255,255,${Math.random() * .06})`;
      ctx.fillRect(Math.random() * W, Math.random() * H, 2, 2);
    }
    ctx.textAlign = 'center';
    ctx.fillStyle = '#c4b5fd';
    ctx.font = '600 30px system-ui, sans-serif';
    ctx.fillText('E U P H O R I A · Т В О Я  Э Й Ф О Р И Я', W / 2, 130);
    ctx.fillStyle = '#ffffff';
    ctx.font = '400 150px Georgia, serif';
    ctx.fillText(ch.name, W / 2, 330);
    ctx.fillStyle = '#a99cc7';
    ctx.font = '400 36px system-ui, sans-serif';
    ctx.fillText(`в исполнении: ${ch.actor}`, W / 2, 400);
    ctx.strokeStyle = ch.b; ctx.lineWidth = 14;
    ctx.beginPath(); ctx.arc(W / 2, 620, 130, 0, Math.PI * 2); ctx.stroke();
    ctx.fillStyle = ch.b;
    ctx.font = '400 96px Georgia, serif';
    ctx.fillText(`${pct}%`, W / 2, 655);
    ctx.fillStyle = '#7d7099';
    ctx.font = '600 26px system-ui, sans-serif';
    ctx.fillText('С О В П А Д Е Н И Е', W / 2, 800);
    ctx.fillStyle = '#e6ddf7';
    ctx.font = 'italic 400 46px Georgia, serif';
    wrapText(ctx, ch.manifest, W / 2, 900, 860, 62);
    ctx.fillStyle = ch.a;
    ctx.font = '600 32px system-ui, sans-serif';
    ctx.fillText(ch.traits.join('  ·  '), W / 2, 1150);
    ctx.fillStyle = '#7d7099';
    ctx.font = '400 28px system-ui, sans-serif';
    ctx.fillText('cinema online · фан-лендинг HBO', W / 2, 1290);
    const a = document.createElement('a');
    a.download = `euphoria-${lastResult.key}.png`;
    a.href = cv.toDataURL('image/png');
    a.click();
    showToast('Открытка сохранена — публикуй ✨');
  } catch {
    showToast('Не удалось создать открытку в этом браузере');
  }
});

renderQuestion();

/* ------------------------------------------------------------
   8. Модалки
------------------------------------------------------------ */
const trailerModal = $('#trailer-modal');
const actorModal   = $('#actor-modal');
let activeModal = null;
let lastFocused = null;

function showModal(modal) {
  lastFocused = document.activeElement;
  activeModal = modal;
  modal.hidden = false;
  document.body.style.overflow = 'hidden';
  $('.modal-close', modal).focus();
}
function hideModal() {
  if (!activeModal) return;
  if (activeModal === trailerModal) cleanupTrailer();
  activeModal.hidden = true;
  activeModal = null;
  document.body.style.overflow = '';
  if (lastFocused) lastFocused.focus();
}
$$('.modal').forEach(modal =>
  $$('[data-close]', modal).forEach(el => el.addEventListener('click', hideModal)));

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    if (activeModal) hideModal();
    else closeMenu();
  }
  if (e.key === 'Tab' && activeModal) {
    const focusables = $$('button, a[href], iframe', activeModal)
      .filter(el => el.offsetParent !== null);
    if (!focusables.length) return;
    const first = focusables[0], last = focusables[focusables.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }
});

/* ------------------------------------------------------------
   9. Трейлер
------------------------------------------------------------ */
const playerFrame    = $('#player-frame');
const countdownEl    = $('#countdown');
const countdownNum   = $('#countdown-num');
const playerFallback = $('#player-fallback');
let countdownTimer = null, trailerFailTimer = null;
let trailerLoaded = false, introDone = false;

function tickNumber() {
  countdownNum.classList.remove('tick');
  void countdownNum.offsetWidth;
  countdownNum.classList.add('tick');
}
function revealPlayer() {
  if (!(trailerLoaded && introDone)) return;
  clearTimeout(trailerFailTimer);
  countdownEl.hidden = true;
  playerFallback.hidden = true;
  playerFrame.classList.add('ready');
}
function openTrailer() {
  showModal(trailerModal);
  trailerLoaded = false; introDone = false;
  playerFrame.classList.remove('ready');
  playerFrame.innerHTML = '';
  playerFallback.hidden = true;
  countdownEl.hidden = false;

  const iframe = document.createElement('iframe');
  iframe.src = VK_EMBED_SRC;
  iframe.title = 'Euphoria — трейлер (VK Видео)';
  iframe.allow = 'autoplay; encrypted-media; fullscreen; picture-in-picture; screen-wake-lock';
  iframe.setAttribute('allowfullscreen', '');
  iframe.addEventListener('load', () => { trailerLoaded = true; revealPlayer(); });
  playerFrame.appendChild(iframe);

  clearInterval(countdownTimer);
  if (reducedMotion) {
    introDone = true; countdownNum.textContent = ''; revealPlayer();
  } else {
    let n = 3;
    countdownNum.textContent = n; tickNumber();
    countdownTimer = setInterval(() => {
      n -= 1;
      if (n <= 0) {
        clearInterval(countdownTimer);
        introDone = true; countdownNum.textContent = ''; revealPlayer();
        return;
      }
      countdownNum.textContent = n; tickNumber();
    }, 800);
  }
  clearTimeout(trailerFailTimer);
  trailerFailTimer = setTimeout(() => {
    if (!trailerLoaded) { countdownEl.hidden = true; playerFallback.hidden = false; }
  }, 10000);
}
function cleanupTrailer() {
  clearInterval(countdownTimer);
  clearTimeout(trailerFailTimer);
  playerFrame.innerHTML = '';
  playerFrame.classList.remove('ready');
}
$('#trailer-btn').addEventListener('click', openTrailer);

/* ------------------------------------------------------------
   10. Модалка актёра
------------------------------------------------------------ */
const actorPhoto = $('#actor-photo');
const actorName  = $('#actor-name');
const actorRole  = $('#actor-role');
const actorBio   = $('#actor-bio');
function openActor(key, cardImg) {
  const data = ACTORS[key];
  if (!data) return;
  actorName.textContent = data.name;
  actorRole.textContent = `в роли: ${data.role}`;
  actorBio.textContent  = data.bio;
  actorPhoto.src = (cardImg && (cardImg.currentSrc || cardImg.src)) ||
                   makePlaceholder(600, 800, data.name.slice(0, 1));
  actorPhoto.alt = data.name;
  showModal(actorModal);
}

/* ------------------------------------------------------------
   11. Соцсети / приложения / профиль
------------------------------------------------------------ */
$$('.social-btn').forEach(btn =>
  btn.addEventListener('click', () => showToast(`Мы в ${btn.dataset.network} — ссылка скоро появится`)));
$$('.app-btn').forEach(btn =>
  btn.addEventListener('click', () => showToast(`Приложение для ${btn.dataset.store} сейчас в разработке`)));
$('#profile-btn').addEventListener('click', () => showToast('Личный кабинет скоро откроется'));

/* ------------------------------------------------------------
   12. Reveal
------------------------------------------------------------ */
const revealEls = $$('.reveal');
if ('IntersectionObserver' in window && !reducedMotion) {
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: .12 });
  revealEls.forEach(el => revealObserver.observe(el));
} else revealEls.forEach(el => el.classList.add('visible'));

/* ------------------------------------------------------------
   13. Ресайз / год
------------------------------------------------------------ */
let resizeTimer = null;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    layoutCast();
    if (window.innerWidth > 760) closeMenu();
  }, 150);
});
$('#year').textContent = String(new Date().getFullYear());