/**
 * ══════════════════════════════════════════════════════════
 * EXPERIÊNCIA DIA DOS NAMORADOS — Matheus & Estephanie
 * js/script.js
 * ══════════════════════════════════════════════════════════
 */

'use strict';

/* ── 1. CONFIGURAÇÃO ──────────────────────────────────────
   Edite aqui as memórias que aparecem nas estrelas (Tela 10).
   Cada entrada tem: emoji, date, title, text e photo (opcional).

   Para adicionar/remover memórias: edite o array STAR_MEMORIES abaixo.
   Para adicionar foto a uma memória: copie para assets/images/memory-X.jpg
   ─────────────────────────────────────────────────────── */
const STAR_MEMORIES = [
  {
    emoji: '💫',
    date: '02/03/2024',
    title: 'O Primeiro Dia',
    text: 'O dia que tudo começou... e que eu nunca vou esquecer.',
    photo: 'assets/images/memory-1.jpg'   // FOTO: adicione assets/images/memory-1.jpg
  },
  {
    emoji: '❤️',
    date: '17/05/2024',
    title: 'Oficialmente Namorados',
    text: 'O dia mais especial. O dia em que você disse sim.',
    photo: 'assets/images/memory-2.jpg'   // FOTO: adicione assets/images/memory-2.jpg
  },
  {
    emoji: '🌙',
    date: '2024',
    title: 'Nossa Primeira Noite',
    text: 'Conversamos até o sol nascer. Sabia que era diferente.',
    photo: 'assets/images/memory-3.jpg'   // FOTO: adicione assets/images/memory-3.jpg
  },
  {
    emoji: '✈️',
    date: '2024',
    title: 'Nossa Primeira Viagem',
    text: 'A primeira de muitas aventuras juntos.',
    photo: 'assets/images/memory-4.jpg'   // FOTO: adicione assets/images/memory-4.jpg
  },
  {
    emoji: '🎂',
    date: '2024',
    title: 'Primeiro Aniversário',
    text: 'A primeira vez que comemoramos algo juntos.',
    photo: 'assets/images/memory-5.jpg'   // FOTO: adicione assets/images/memory-5.jpg
  },
  {
    emoji: '🌅',
    date: '2025',
    title: 'Nosso Primeiro Ano',
    text: 'Um ano inteiro de crescimento, amor e cumplicidade.',
    photo: 'assets/images/memory-6.jpg'   // FOTO: adicione assets/images/memory-6.jpg
  },
  {
    emoji: '🎵',
    date: 'Sempre',
    title: 'Nossa Música',
    text: 'Lover — Taylor Swift. Toda vez que ouço, penso em você.',
    photo: null
  },
  {
    emoji: '🌟',
    date: 'Todo dia',
    title: 'Cada Momento',
    text: 'Cada café da manhã, cada risada, cada abraço. É você.',
    photo: null
  }
];

/*
  MÚSICA:
  O arquivo deve ser adicionado em: assets/music/lover.mp3
  A música inicia automaticamente quando o usuário clica em "Abrir Nossa História".
  O player na Tela 9 controla a mesma música.
*/
const MUSIC_SRC = 'assets/music/lover.mp3';

/* Datas do casal */
const DATE_NAMORO    = new Date(2024, 4, 17, 0, 0, 0);  // 17/05/2024
const DATE_PRIMEIRO  = new Date(2024, 2, 2, 0, 0, 0);   // 02/03/2024

const TOTAL_SLIDES = 11;  // Slides 0 a 10 (Telas 2 a 12)


/* ── 2. ESTADO ────────────────────────────────────────── */
const state = {
  currentSlide: 0,
  isAnimating: false,
  isMusicPlaying: false,
  isLoopOn: false,
  touchStartX: 0,
  touchStartY: 0,
  touchStartTime: 0,
  isDragging: false,
  dragStartX: 0,
  dragCurrentX: 0,
  counterInterval: null,
  starCanvas: null,
  starCtx: null,
  stars: [],
  animFrameId: null,
};


/* ── 3. DOM REFERENCES ────────────────────────────────── */
const $ = id => document.getElementById(id);

const dom = {
  lockScreen:     $('lock-screen'),
  lockBtn:        $('lock-btn'),
  lockTime:       $('lock-time'),
  lockDate:       $('lock-date'),
  experience:     $('experience'),
  storiesBar:     $('stories-bar'),
  slidesTrack:    $('slides-track'),
  navLeft:        $('nav-left'),
  navRight:       $('nav-right'),

  // Counter
  countYears:     $('count-years'),
  countMonths:    $('count-months'),
  countDays:      $('count-days'),
  countHours:     $('count-hours'),
  countMinutes:   $('count-minutes'),
  countSeconds:   $('count-seconds'),

  // Music
  ctrlPlay:       $('ctrl-play'),
  ctrlRewind:     $('ctrl-rewind'),
  ctrlLoop:       $('ctrl-loop'),
  progTrack:      $('player-prog-track'),
  progFill:       $('player-prog-fill'),
  progThumb:      $('player-prog-thumb'),
  timeCur:        $('player-time-cur'),
  timeTot:        $('player-time-tot'),
  vinylDisc:      $('vinyl-disc'),
  albumArtPh:     $('album-art-ph'),
  musicNote:      $('music-file-note'),

  // Star canvas
  starCanvas:     $('star-canvas'),

  // Transition
  transMain:      $('transition-main'),
  transSub:       $('transition-sub'),
  transDots:      document.querySelector('.transition-dots'),

  // Declaration
  declTexts:      $('decl-texts'),
  declSignature:  $('decl-signature'),

  // Lightbox
  lightbox:       $('lightbox'),
  lbOverlay:      $('lb-overlay'),
  lbClose:        $('lb-close'),
  lbImg:          $('lb-img'),
  lbCaption:      $('lb-caption'),

  // Memory Modal
  memoryModal:    $('memory-modal'),
  mmOverlay:      $('mm-overlay'),
  mmClose:        $('mm-close'),
  mmBody:         $('mm-body'),

  // Video Modal
  videoModal:     $('video-modal'),
  vmOverlay:      $('vm-overlay'),
  vmClose:        $('vm-close'),
  modalVideo:     $('modal-video'),
  modalVideoSrc:  $('modal-video-src'),
  vmTitle:        $('vm-title-text'),
};


/* ── 4. AUDIO ─────────────────────────────────────────── */
let audio = null;

function initAudio() {
  if (audio) return;
  try {
    audio = new Audio();
    audio.preload = 'none';
    audio.loop = false;
    audio.src = MUSIC_SRC;
    audio.addEventListener('timeupdate', onAudioTimeUpdate);
    audio.addEventListener('loadedmetadata', onAudioMetadata);
    audio.addEventListener('ended', onAudioEnded);
    audio.addEventListener('error', () => {
      /* Música não disponível — modo silencioso */
      if (dom.musicNote) dom.musicNote.style.display = 'block';
    });
  } catch (e) {
    audio = null;
  }
}

function playMusic() {
  if (!audio) initAudio();
  if (!audio) return;
  audio.play().then(() => {
    state.isMusicPlaying = true;
    updatePlayerUI();
  }).catch(() => { /* bloqueado pelo browser */ });
}

function pauseMusic() {
  if (!audio) return;
  audio.pause();
  state.isMusicPlaying = false;
  updatePlayerUI();
}

function toggleMusic() {
  if (state.isMusicPlaying) pauseMusic();
  else playMusic();
}

function onAudioTimeUpdate() {
  if (!audio || !audio.duration) return;
  const pct = (audio.currentTime / audio.duration) * 100;
  if (dom.progFill)  dom.progFill.style.width = pct + '%';
  if (dom.progThumb) dom.progThumb.style.left = pct + '%';
  if (dom.timeCur)   dom.timeCur.textContent = formatTime(audio.currentTime);
}

function onAudioMetadata() {
  if (!audio) return;
  if (dom.timeTot) dom.timeTot.textContent = formatTime(audio.duration);
  if (dom.musicNote) dom.musicNote.style.display = 'none';
}

function onAudioEnded() {
  if (state.isLoopOn && audio) {
    audio.currentTime = 0;
    audio.play();
  } else {
    state.isMusicPlaying = false;
    updatePlayerUI();
  }
}

function updatePlayerUI() {
  const playIcon  = dom.ctrlPlay ? dom.ctrlPlay.querySelector('.icon-play')  : null;
  const pauseIcon = dom.ctrlPlay ? dom.ctrlPlay.querySelector('.icon-pause') : null;
  if (playIcon)  playIcon.style.display  = state.isMusicPlaying ? 'none' : 'block';
  if (pauseIcon) pauseIcon.style.display = state.isMusicPlaying ? 'block' : 'none';

  if (dom.vinylDisc) {
    if (state.isMusicPlaying) dom.vinylDisc.classList.add('is-spinning');
    else dom.vinylDisc.classList.remove('is-spinning');
  }
}

function seekAudio(e) {
  if (!audio || !audio.duration) return;
  const rect = dom.progTrack.getBoundingClientRect();
  const x = (e.clientX || (e.touches && e.touches[0].clientX) || 0) - rect.left;
  const pct = Math.max(0, Math.min(1, x / rect.width));
  audio.currentTime = pct * audio.duration;
}

function formatTime(secs) {
  if (isNaN(secs)) return '0:00';
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}


/* ── 5. LOCK SCREEN ──────────────────────────────────── */
function updateLockClock() {
  const now = new Date();

  // Hora
  const h = now.getHours().toString().padStart(2, '0');
  const m = now.getMinutes().toString().padStart(2, '0');
  if (dom.lockTime) dom.lockTime.textContent = `${h}:${m}`;

  // Data em português
  const DIAS   = ['Domingo','Segunda-feira','Terça-feira','Quarta-feira','Quinta-feira','Sexta-feira','Sábado'];
  const MESES  = ['janeiro','fevereiro','março','abril','maio','junho','julho','agosto','setembro','outubro','novembro','dezembro'];
  const dia    = DIAS[now.getDay()];
  const date   = now.getDate();
  const mes    = MESES[now.getMonth()];
  if (dom.lockDate) dom.lockDate.textContent = `${dia}, ${date} de ${mes}`;
}

function unlockExperience() {
  // Inicia música
  initAudio();
  playMusic();

  // Anima saída da lock screen
  dom.lockScreen.classList.add('is-unlocking');

  // Mostra experience
  dom.experience.classList.remove('is-hidden');
  requestAnimationFrame(() => {
    dom.experience.classList.add('is-visible');
  });

  // Remove lock screen após transição
  setTimeout(() => {
    dom.lockScreen.style.display = 'none';
    dom.experience.removeAttribute('aria-hidden');
    // Ativa animação do slide 0
    activateSlide(0);
  }, 750);
}


/* ── 6. STORIES PROGRESS BAR ─────────────────────────── */
function buildProgressBar() {
  if (!dom.storiesBar) return;
  dom.storiesBar.innerHTML = '';
  for (let i = 0; i < TOTAL_SLIDES; i++) {
    const seg = document.createElement('div');
    seg.className = 'story-seg';
    seg.setAttribute('role', 'button');
    seg.setAttribute('aria-label', `Slide ${i + 1}`);
    seg.dataset.idx = i;

    const fill = document.createElement('div');
    fill.className = 'story-seg-fill';
    seg.appendChild(fill);

    seg.addEventListener('click', () => goToSlide(i));
    dom.storiesBar.appendChild(seg);
  }
  updateProgressBar();
}

function updateProgressBar() {
  const segs = dom.storiesBar ? dom.storiesBar.querySelectorAll('.story-seg') : [];
  segs.forEach((seg, i) => {
    seg.classList.remove('is-done', 'is-active');
    if (i < state.currentSlide)  seg.classList.add('is-done');
    if (i === state.currentSlide) seg.classList.add('is-active');
  });
}


/* ── 7. NAVIGATION ENGINE ────────────────────────────── */
function goToSlide(idx) {
  const target = Math.max(0, Math.min(TOTAL_SLIDES - 1, idx));
  if (target === state.currentSlide && !state.isAnimating) return;

  state.isAnimating = true;
  state.currentSlide = target;

  // Move track
  const offset = target * window.innerWidth;
  dom.slidesTrack.style.transform = `translateX(-${offset}px)`;

  updateProgressBar();

  // Pause animating flag after transition
  setTimeout(() => {
    state.isAnimating = false;
    activateSlide(target);
  }, 650);
}

function nextSlide() {
  if (state.currentSlide < TOTAL_SLIDES - 1) goToSlide(state.currentSlide + 1);
}

function prevSlide() {
  if (state.currentSlide > 0) goToSlide(state.currentSlide - 1);
}

/* Touch / Swipe */
function initSwipe() {
  const track = dom.slidesTrack;

  track.addEventListener('touchstart', e => {
    state.touchStartX    = e.touches[0].clientX;
    state.touchStartY    = e.touches[0].clientY;
    state.touchStartTime = Date.now();
  }, { passive: true });

  track.addEventListener('touchend', e => {
    const dx   = e.changedTouches[0].clientX - state.touchStartX;
    const dy   = e.changedTouches[0].clientY - state.touchStartY;
    const dt   = Date.now() - state.touchStartTime;
    const dist = Math.abs(dx);

    // Ignora scroll vertical
    if (Math.abs(dy) > Math.abs(dx)) return;

    // Swipe mínimo: 50px ou velocidade alta
    const isSwipe = dist > 50 || (dist > 20 && dt < 250);
    if (!isSwipe || state.isAnimating) return;

    if (dx < 0) nextSlide();
    else         prevSlide();
  }, { passive: true });

  /* Mouse drag (desktop) */
  track.addEventListener('mousedown', e => {
    state.isDragging  = true;
    state.dragStartX  = e.clientX;
    state.dragCurrentX = e.clientX;
    track.style.cursor = 'grabbing';
  });

  document.addEventListener('mousemove', e => {
    if (!state.isDragging) return;
    state.dragCurrentX = e.clientX;
  });

  document.addEventListener('mouseup', e => {
    if (!state.isDragging) return;
    state.isDragging = false;
    track.style.cursor = '';
    const dx = e.clientX - state.dragStartX;
    if (Math.abs(dx) > 60 && !state.isAnimating) {
      if (dx < 0) nextSlide();
      else         prevSlide();
    }
  });
}

/* Keyboard */
function initKeyboard() {
  document.addEventListener('keydown', e => {
    if (dom.lightbox && !dom.lightbox.classList.contains('is-hidden')) {
      if (e.key === 'Escape') closeLightbox();
      return;
    }
    if (dom.memoryModal && !dom.memoryModal.classList.contains('is-hidden')) {
      if (e.key === 'Escape') closeMemoryModal();
      return;
    }
    if (dom.videoModal && !dom.videoModal.classList.contains('is-hidden')) {
      if (e.key === 'Escape') closeVideoModal();
      return;
    }

    switch(e.key) {
      case 'ArrowRight': case 'ArrowDown': nextSlide(); break;
      case 'ArrowLeft':  case 'ArrowUp':   prevSlide(); break;
      case ' ':
        e.preventDefault();
        toggleMusic();
        break;
    }
  });
}


/* ── 8. SLIDE ACTIVATION (on-enter animations) ─────── */
function activateSlide(idx) {
  switch(idx) {
    case 0: activateValentines(); break;
    case 1: activateCounter();    break;
    case 8: activateStarCanvas(); break;
    case 9: activateTransition(); break;
    case 10: activateDeclaration(); break;
  }
}


/* ── 9. SLIDE 0 — VALENTINES (Particles) ─────────────── */
function activateValentines() {
  const wrap = $('particles-wrap');
  if (!wrap || wrap.dataset.initialized) return;
  wrap.dataset.initialized = '1';

  for (let i = 0; i < 18; i++) {
    createParticle(wrap);
  }
}

function createParticle(container) {
  const p = document.createElement('div');
  p.className = 'particle';
  const size  = Math.random() * 6 + 2;
  const left  = Math.random() * 100;
  const delay = Math.random() * 8;
  const dur   = Math.random() * 10 + 12;
  const opacity = Math.random() * 0.4 + 0.1;

  p.style.cssText = `
    width: ${size}px;
    height: ${size}px;
    left: ${left}%;
    bottom: -${size}px;
    animation-duration: ${dur}s;
    animation-delay: -${delay}s;
    opacity: ${opacity};
  `;
  container.appendChild(p);
}


/* ── 10. SLIDE 1 — COUNTER ───────────────────────────── */
function activateCounter() {
  // Ambient stars in background
  buildAmbientStars();

  // Start/restart counter
  if (state.counterInterval) clearInterval(state.counterInterval);
  updateCounter();
  state.counterInterval = setInterval(updateCounter, 1000);
}

function updateCounter() {
  const now = new Date();
  let years   = now.getFullYear() - DATE_NAMORO.getFullYear();
  let months  = now.getMonth()    - DATE_NAMORO.getMonth();
  let days    = now.getDate()     - DATE_NAMORO.getDate();
  let hours   = now.getHours()    - DATE_NAMORO.getHours();
  let minutes = now.getMinutes()  - DATE_NAMORO.getMinutes();
  let seconds = now.getSeconds()  - DATE_NAMORO.getSeconds();

  if (seconds < 0) { seconds += 60; minutes--; }
  if (minutes < 0) { minutes += 60; hours--; }
  if (hours < 0)   { hours += 24;   days--; }
  if (days < 0) {
    months--;
    const prevMonthDays = new Date(now.getFullYear(), now.getMonth(), 0).getDate();
    days += prevMonthDays;
  }
  if (months < 0) { months += 12; years--; }

  const pad = n => String(Math.max(0, n)).padStart(2, '0');
  if (dom.countYears)   dom.countYears.textContent   = pad(years);
  if (dom.countMonths)  dom.countMonths.textContent  = pad(months);
  if (dom.countDays)    dom.countDays.textContent    = pad(days);
  if (dom.countHours)   dom.countHours.textContent   = pad(hours);
  if (dom.countMinutes) dom.countMinutes.textContent = pad(minutes);
  if (dom.countSeconds) dom.countSeconds.textContent = pad(seconds);
}

function buildAmbientStars() {
  const container = $('ambient-stars');
  if (!container || container.dataset.initialized) return;
  container.dataset.initialized = '1';
  for (let i = 0; i < 60; i++) {
    const s = document.createElement('div');
    s.className = 'amb-star';
    const size  = Math.random() * 2 + 0.5;
    const dur   = Math.random() * 4 + 2;
    const delay = Math.random() * 6;
    s.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${Math.random() * 100}%;
      top: ${Math.random() * 100}%;
      animation-duration: ${dur}s;
      animation-delay: -${delay}s;
      opacity: ${Math.random() * 0.5 + 0.1};
    `;
    container.appendChild(s);
  }
}


/* ── 11. SLIDE 7 — MUSIC PLAYER ─────────────────────── */
function initMusicPlayer() {
  if (!dom.ctrlPlay) return;

  dom.ctrlPlay.addEventListener('click', toggleMusic);

  dom.ctrlRewind.addEventListener('click', () => {
    if (audio) {
      audio.currentTime = 0;
      if (!state.isMusicPlaying) playMusic();
    }
  });

  dom.ctrlLoop.addEventListener('click', () => {
    state.isLoopOn = !state.isLoopOn;
    if (dom.ctrlLoop) {
      dom.ctrlLoop.style.color = state.isLoopOn
        ? 'var(--rose)'
        : 'rgba(255,255,255,0.6)';
    }
  });

  // Progress bar click / drag
  if (dom.progTrack) {
    dom.progTrack.addEventListener('click', seekAudio);
    dom.progTrack.addEventListener('touchstart', e => {
      seekAudio(e.touches[0]);
    }, { passive: true });
  }
}


/* ── 12. SLIDE 8 — STARRY SKY CANVAS ────────────────── */
function activateStarCanvas() {
  if (!dom.starCanvas) return;
  const canvas = dom.starCanvas;
  const ctx = canvas.getContext('2d');

  canvas.width  = canvas.offsetWidth  || window.innerWidth;
  canvas.height = canvas.offsetHeight || window.innerHeight;

  // Stop any existing animation
  if (state.animFrameId) cancelAnimationFrame(state.animFrameId);

  // Build stars
  state.stars = [];

  // Regular (background) stars
  for (let i = 0; i < 180; i++) {
    state.stars.push({
      x:       Math.random() * canvas.width,
      y:       Math.random() * canvas.height,
      r:       Math.random() * 1.2 + 0.3,
      opacity: Math.random(),
      speed:   (Math.random() * 0.008 + 0.003) * (Math.random() > 0.5 ? 1 : -1),
      memory:  null,
      clickable: false,
    });
  }

  // Memory stars (larger, pulsing)
  STAR_MEMORIES.forEach((mem, i) => {
    state.stars.push({
      x:        Math.random() * (canvas.width - 60)  + 30,
      y:        Math.random() * (canvas.height - 140) + 70,
      r:        3.5 + Math.random() * 2,
      opacity:  0.9,
      speed:    0.015 * (Math.random() > 0.5 ? 1 : -1),
      memory:   mem,
      clickable: true,
      hovered:  false,
    });
  });

  // Animation loop
  function drawStars() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    state.stars.forEach(s => {
      // Twinkle
      s.opacity += s.speed;
      if (s.opacity > 1)   { s.opacity = 1;   s.speed = -Math.abs(s.speed); }
      if (s.opacity < 0.05){ s.opacity = 0.05; s.speed = Math.abs(s.speed); }

      ctx.beginPath();

      if (s.clickable) {
        // Draw 4-point star shape for memory stars
        const r = s.r * (s.hovered ? 1.5 : 1);
        ctx.save();
        ctx.translate(s.x, s.y);
        ctx.globalAlpha = s.opacity;

        // Glow
        const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, r * 5);
        grad.addColorStop(0, 'rgba(245,194,215,0.6)');
        grad.addColorStop(1, 'rgba(245,194,215,0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(0, 0, r * 5, 0, Math.PI * 2);
        ctx.fill();

        // Star core
        ctx.fillStyle = 'rgba(255,255,255,0.95)';
        drawStar4(ctx, 0, 0, r, r * 2.5);
        ctx.fill();
        ctx.restore();
      } else {
        // Simple round star
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${s.opacity})`;
        ctx.fill();
      }
    });

    state.animFrameId = requestAnimationFrame(drawStars);
  }

  drawStars();

  // Click / tap on stars
  function handleStarClick(e) {
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || (e.touches && e.touches[0].clientX)) - rect.left;
    const y = (e.clientY || (e.touches && e.touches[0].clientY)) - rect.top;

    for (const s of state.stars) {
      if (!s.clickable) continue;
      const dist = Math.hypot(x - s.x, y - s.y);
      if (dist < s.r * 8) {
        openMemoryModal(s.memory);
        break;
      }
    }
  }

  function handleStarHover(e) {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    state.stars.forEach(s => {
      if (!s.clickable) return;
      s.hovered = Math.hypot(x - s.x, y - s.y) < s.r * 10;
    });
    canvas.style.cursor = state.stars.some(s => s.clickable && s.hovered) ? 'pointer' : 'default';
  }

  canvas.removeEventListener('click', canvas._clickHandler);
  canvas.removeEventListener('mousemove', canvas._hoverHandler);
  canvas._clickHandler = handleStarClick;
  canvas._hoverHandler = handleStarHover;
  canvas.addEventListener('click', handleStarClick);
  canvas.addEventListener('touchstart', handleStarClick, { passive: true });
  canvas.addEventListener('mousemove', handleStarHover);
}

function drawStar4(ctx, cx, cy, innerR, outerR) {
  const points = 4;
  ctx.beginPath();
  for (let i = 0; i < points * 2; i++) {
    const angle = (i * Math.PI) / points - Math.PI / 2;
    const r = i % 2 === 0 ? outerR : innerR;
    ctx.lineTo(cx + r * Math.cos(angle), cy + r * Math.sin(angle));
  }
  ctx.closePath();
}


/* ── 13. SLIDE 9 — TRANSITION ────────────────────────── */
function activateTransition() {
  const main = dom.transMain;
  const sub  = dom.transSub;
  const dots = dom.transDots;

  if (main) setTimeout(() => main.classList.add('is-revealed'), 400);
  if (dots) setTimeout(() => dots.classList.add('is-visible'),  900);
  if (sub)  setTimeout(() => sub.classList.add('is-revealed'),  1500);
}


/* ── 14. SLIDE 10 — DECLARATION ─────────────────────── */
function activateDeclaration() {
  const paras = dom.declTexts ? dom.declTexts.querySelectorAll('.decl-para') : [];
  paras.forEach((p, i) => {
    setTimeout(() => p.classList.add('is-revealed'), 500 + i * 600);
  });
  if (dom.declSignature) {
    setTimeout(() => dom.declSignature.classList.add('is-revealed'), 500 + paras.length * 600);
  }

  // Small declaration particles
  buildDeclParticles();
}

function buildDeclParticles() {
  const container = $('decl-particles');
  if (!container || container.dataset.initialized) return;
  container.dataset.initialized = '1';
  for (let i = 0; i < 12; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const size  = Math.random() * 4 + 1;
    const dur   = Math.random() * 15 + 20;
    const delay = Math.random() * 10;
    p.style.cssText = `
      width: ${size}px; height: ${size}px;
      left: ${Math.random() * 100}%;
      bottom: -${size}px;
      animation-duration: ${dur}s;
      animation-delay: -${delay}s;
      opacity: ${Math.random() * 0.2 + 0.05};
    `;
    container.appendChild(p);
  }
}


/* ── 15. LIGHTBOX ─────────────────────────────────────── */
function openLightbox(src, caption) {
  if (!src || !dom.lightbox) return;
  dom.lbImg.src        = src;
  dom.lbImg.alt        = caption || '';
  dom.lbCaption.textContent = caption || '';
  dom.lightbox.classList.remove('is-hidden');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  if (!dom.lightbox) return;
  dom.lightbox.classList.add('is-hidden');
  dom.lbImg.src = '';
  document.body.style.overflow = '';
}


/* ── 16. MEMORY MODAL ─────────────────────────────────── */
function openMemoryModal(mem) {
  if (!mem || !dom.memoryModal) return;
  dom.mmBody.innerHTML = `
    <div class="mm-emoji">${mem.emoji}</div>
    <p class="mm-date">${mem.date}</p>
    <h3 class="mm-title">${mem.title}</h3>
    <p class="mm-text">${mem.text}</p>
    ${mem.photo ? `<img src="${mem.photo}" class="mm-photo" alt="${mem.title}" onerror="this.style.display='none'">` : ''}
  `;
  dom.memoryModal.classList.remove('is-hidden');
  document.body.style.overflow = 'hidden';
}

function closeMemoryModal() {
  if (!dom.memoryModal) return;
  dom.memoryModal.classList.add('is-hidden');
  document.body.style.overflow = '';
}


/* ── 17. VIDEO MODAL ─────────────────────────────────── */
function openVideoModal(src, title) {
  if (!src || !dom.videoModal) return;
  dom.modalVideoSrc.src = src;
  dom.modalVideo.load();
  dom.vmTitle.textContent = title || '';
  dom.videoModal.classList.remove('is-hidden');
  document.body.style.overflow = 'hidden';
}

function closeVideoModal() {
  if (!dom.videoModal) return;
  dom.modalVideo.pause();
  dom.modalVideoSrc.src = '';
  dom.videoModal.classList.add('is-hidden');
  document.body.style.overflow = '';
}


/* ── 18. VIDEO CARDS (inline play) ──────────────────── */
function initVideoCards() {
  const overlays = document.querySelectorAll('.video-play-overlay');
  overlays.forEach(overlay => {
    const idx = parseInt(overlay.dataset.vidIdx, 10);
    const videoEl = document.getElementById(`video-el-${idx}`);
    if (!videoEl) return;

    overlay.addEventListener('click', () => {
      overlay.classList.add('is-hidden');
      videoEl.controls = true;
      videoEl.play().catch(() => {});
    });
  });
}


/* ── 19. WINDOW RESIZE ───────────────────────────────── */
function onResize() {
  // Reposition slides
  const offset = state.currentSlide * window.innerWidth;
  dom.slidesTrack.style.transition = 'none';
  dom.slidesTrack.style.transform = `translateX(-${offset}px)`;
  requestAnimationFrame(() => {
    dom.slidesTrack.style.transition = '';
  });

  // Resize canvas
  if (dom.starCanvas && state.currentSlide === 8) {
    dom.starCanvas.width  = dom.starCanvas.offsetWidth;
    dom.starCanvas.height = dom.starCanvas.offsetHeight;
    activateStarCanvas();
  }
}


/* ── 20. EXPOSE GLOBALS ──────────────────────────────── */
/* Funções chamadas pelo HTML onclick */
window.openLightbox   = openLightbox;
window.closeLightbox  = closeLightbox;
window.openVideoModal = openVideoModal;
window.closeVideoModal = closeVideoModal;
window.openMemoryModal = openMemoryModal;
window.closeMemoryModal = closeMemoryModal;


/* ── 21. INIT ─────────────────────────────────────────── */
function init() {
  /* Lock screen clock */
  updateLockClock();
  setInterval(updateLockClock, 5000);

  /* Unlock button */
  if (dom.lockBtn) {
    dom.lockBtn.addEventListener('click', unlockExperience);
  }

  /* Build progress bar */
  buildProgressBar();

  /* Navigation */
  if (dom.navLeft)  dom.navLeft.addEventListener('click', prevSlide);
  if (dom.navRight) dom.navRight.addEventListener('click', nextSlide);
  initSwipe();
  initKeyboard();

  /* Music player */
  initMusicPlayer();

  /* Video inline cards */
  initVideoCards();

  /* Lightbox close */
  if (dom.lbOverlay) dom.lbOverlay.addEventListener('click', closeLightbox);
  if (dom.lbClose)   dom.lbClose.addEventListener('click', closeLightbox);

  /* Memory modal close */
  if (dom.mmOverlay) dom.mmOverlay.addEventListener('click', closeMemoryModal);
  if (dom.mmClose)   dom.mmClose.addEventListener('click', closeMemoryModal);

  /* Video modal close */
  if (dom.vmOverlay) dom.vmOverlay.addEventListener('click', closeVideoModal);
  if (dom.vmClose)   dom.vmClose.addEventListener('click', closeVideoModal);

  /* Resize handler */
  window.addEventListener('resize', onResize);

  /* Prevenção de comportamentos padrão indesejados */
  document.addEventListener('touchmove', e => {
    /* Permite scroll vertical dentro dos slides, bloqueia horizontal geral */
    if (Math.abs(e.touches[0].clientX - (state.touchStartX || 0)) >
        Math.abs(e.touches[0].clientY - (state.touchStartY || 0))) {
      /* horizontal swipe */
    }
  }, { passive: true });

  console.log('💕 Experiência carregada — Matheus & Estephanie');
}

/* Inicia quando o DOM estiver pronto */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
