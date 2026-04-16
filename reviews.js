/* ================================================================
   HELL OUT CAFE — Review Engine
   ================================================================
   Storage: localStorage with STACK architecture
   - Each stack holds STACK_SIZE reviews
   - When full, a new stack file is created automatically
   - Stack keys: hellout_reviews_stack_0, hellout_reviews_stack_1, …
   - Positive reviews (rating >= 4) feed the infinite scroll strip
   ================================================================ */

const STACK_SIZE   = 10;       // reviews per stack
const STACK_PREFIX = 'hellout_reviews_stack_';
const MIN_POSITIVE = 4;        // rating >= 4 = positive

// ── STORAGE HELPERS ─────────────────────────────────────────────

function getAllStacks() {
  const stacks = [];
  let i = 0;
  while (true) {
    const raw = localStorage.getItem(STACK_PREFIX + i);
    if (!raw) break;
    stacks.push(JSON.parse(raw));
    i++;
  }
  return stacks;
}

function getCurrentStackIndex() {
  let i = 0;
  while (localStorage.getItem(STACK_PREFIX + i) !== null) i++;
  // The last existing stack index (or 0 if none)
  return Math.max(0, i - 1);
}

function getStack(index) {
  const raw = localStorage.getItem(STACK_PREFIX + index);
  return raw ? JSON.parse(raw) : [];
}

function saveStack(index, data) {
  localStorage.setItem(STACK_PREFIX + index, JSON.stringify(data));
}

/**
 * Push a new review into the current stack.
 * If the current stack is full, create a new one.
 */
function pushReview(review) {
  let stacks = getAllStacks();
  if (stacks.length === 0) {
    // First review ever
    saveStack(0, [review]);
    return;
  }
  let idx = stacks.length - 1;
  let current = stacks[idx];
  if (current.length >= STACK_SIZE) {
    // Current stack full — open a new stack
    idx += 1;
    current = [];
    console.log(`[Reviews] Stack ${idx - 1} full. Created stack ${idx}.`);
  }
  current.push(review);
  saveStack(idx, current);
}

/** Flatten all stacks into a single array, newest first */
function getAllReviews() {
  const stacks = getAllStacks();
  return stacks.flat().reverse();
}

/** Only positive reviews (rating >= MIN_POSITIVE), newest first */
function getPositiveReviews() {
  return getAllReviews().filter(r => r.rating >= MIN_POSITIVE);
}

// ── UNIQUE ID ────────────────────────────────────────────────────

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

// ── STAR RATING HTML ────────────────────────────────────────────

function starsHtml(rating, interactive = false) {
  if (interactive) {
    return Array.from({ length: 5 }, (_, i) =>
      `<span class="star-input" data-val="${i + 1}" title="${i + 1} star${i > 0 ? 's' : ''}">★</span>`
    ).join('');
  }
  return Array.from({ length: 5 }, (_, i) =>
    `<span class="${i < rating ? 'star-filled' : 'star-empty'}">★</span>`
  ).join('');
}

// ── AVATAR INITIALS ──────────────────────────────────────────────

function initials(name) {
  return name.trim().split(/\s+/).map(w => w[0].toUpperCase()).slice(0, 2).join('');
}

// ── AVATAR COLOR (deterministic from name) ───────────────────────

const AVATAR_COLORS = [
  'linear-gradient(135deg,#E63900,#FF6B00)',
  'linear-gradient(135deg,#FF6B00,#FFA500)',
  'linear-gradient(135deg,#9B59B6,#E23744)',
  'linear-gradient(135deg,#2980B9,#6DD5FA)',
  'linear-gradient(135deg,#27AE60,#2ECC71)',
  'linear-gradient(135deg,#F39C12,#E74C3C)',
];
function avatarColor(name) {
  let hash = 0;
  for (const c of name) hash = (hash << 5) - hash + c.charCodeAt(0);
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

// ── TIMEAGO ──────────────────────────────────────────────────────

function timeAgo(iso) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  const h = Math.floor(m / 60);
  const d = Math.floor(h / 24);
  if (m < 2)  return 'Just now';
  if (m < 60) return `${m}m ago`;
  if (h < 24) return `${h}h ago`;
  if (d < 7)  return `${d}d ago`;
  return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

// ── SEEDED REVIEWS (shown before any user reviews) ───────────────

const SEED_REVIEWS = [
  { id:'seed1', name:'Rahul M.',     rating:5, text:'The charcoal pizza here is absolutely insane! The crust has this smoky flavour you simply cannot get anywhere else in Chakan. Maha Raja burger is a must-try. Totally worth every rupee!', timestamp: new Date(Date.now() - 864e5 * 3).toISOString() },
  { id:'seed2', name:'Priya S.',     rating:5, text:'Best cafe in Chakan, hands down. Cold coffee is refreshing and the grilled paneer sandwich is so good. Prices are super affordable. We come here every week!', timestamp: new Date(Date.now() - 864e5 * 7).toISOString() },
  { id:'seed3', name:'Amit K.',      rating:5, text:'Tried the Kullad Pizza and it blew my mind — such a unique concept. Chicken roll and smily fries for my kids were a hit. Great family spot. Will definitely come back!', timestamp: new Date(Date.now() - 864e5 * 1).toISOString() },
  { id:'seed4', name:'Sneha R.',     rating:4, text:'Love the vibe and the food. The cheese blast sandwich is unreal. Cold coffee is probably the best in the area. Slightly crowded on weekends but totally worth it!', timestamp: new Date(Date.now() - 864e5 * 5).toISOString() },
  { id:'seed5', name:'Vikram P.',    rating:5, text:'Chicken salami sub is absolutely filling and delicious. The charcoal taste in the pizza is something else. Great staff, quick service. Highly recommend!', timestamp: new Date(Date.now() - 864e5 * 2).toISOString() },
  { id:'seed6', name:'Anjali D.',    rating:5, text:'Brought my kids and everyone was happy. Smiley fries were a huge hit! The kids pizza was perfectly sized. Parents can enjoy a burger while kids enjoy their meal. Perfect!', timestamp: new Date(Date.now() - 864e5 * 10).toISOString() },
];

function getMergedReviews() {
  const user = getAllReviews();
  // Avoid duplicate seed IDs if user re-saved seeds somehow
  const userIds = new Set(user.map(r => r.id));
  const seeds = SEED_REVIEWS.filter(s => !userIds.has(s.id));
  return [...user, ...seeds].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
}

function getMergedPositive() {
  return getMergedReviews().filter(r => r.rating >= MIN_POSITIVE);
}

// ── CAROUSEL ─────────────────────────────────────────────────────

let carouselIndex = 0;
let carouselReviews = [];
let carouselAutoTimer = null;

function buildCarouselCard(review, index) {
  const active = index === carouselIndex ? 'active' : '';
  const pos = index - carouselIndex;
  const isLeft  = pos < 0;
  const isRight = pos > 0;
  const side = isLeft ? 'left' : isRight ? 'right' : '';
  return `
    <div class="rv-card ${active} ${side}" data-index="${index}" onclick="goToCarousel(${index})">
      <div class="rv-card-inner">
        <div class="rv-card-top">
          <div class="rv-stars">${starsHtml(review.rating)}</div>
          <span class="rv-time">${timeAgo(review.timestamp)}</span>
        </div>
        <p class="rv-text">"${review.text}"</p>
        <div class="rv-author">
          <div class="rv-avatar" style="background:${avatarColor(review.name)}">${initials(review.name)}</div>
          <div class="rv-author-info">
            <div class="rv-name">${review.name}</div>
            <div class="rv-via">Verified Review</div>
          </div>
          ${review.rating >= 4 ? '<span class="rv-pos-badge">👍</span>' : ''}
        </div>
      </div>
    </div>`;
}

function renderCarousel() {
  const wrap = document.getElementById('rvCarouselTrack');
  if (!wrap) return;
  carouselReviews = getMergedReviews();
  if (carouselReviews.length === 0) {
    wrap.innerHTML = `<div style="color:var(--ash);text-align:center;padding:40px;">No reviews yet. Be the first!</div>`;
    return;
  }
  carouselIndex = Math.min(carouselIndex, carouselReviews.length - 1);
  wrap.innerHTML = carouselReviews.map((r, i) => buildCarouselCard(r, i)).join('');
  updateCarouselDots();
}

function goToCarousel(index) {
  carouselReviews = getMergedReviews();
  carouselIndex = ((index % carouselReviews.length) + carouselReviews.length) % carouselReviews.length;
  renderCarousel();
  resetCarouselAuto();
}

function prevCarousel() { goToCarousel(carouselIndex - 1); }
function nextCarousel() { goToCarousel(carouselIndex + 1); }

function resetCarouselAuto() {
  clearInterval(carouselAutoTimer);
  carouselAutoTimer = setInterval(() => goToCarousel(carouselIndex + 1), 4500);
}

function updateCarouselDots() {
  const dotsWrap = document.getElementById('rvDots');
  if (!dotsWrap) return;
  dotsWrap.innerHTML = carouselReviews.map((_, i) =>
    `<button class="rv-dot ${i === carouselIndex ? 'active' : ''}" onclick="goToCarousel(${i})" aria-label="Review ${i+1}"></button>`
  ).join('');
}

// Touch / swipe support
let touchStartX = 0;
function initCarouselSwipe() {
  const track = document.getElementById('rvCarouselTrack');
  if (!track) return;
  track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 50) dx < 0 ? nextCarousel() : prevCarousel();
  });
}

// ── INFINITE SCROLL STRIP ────────────────────────────────────────

function buildScrollItem(review) {
  return `
    <div class="rv-scroll-item">
      <div class="rv-scroll-stars">${starsHtml(review.rating)}</div>
      <p class="rv-scroll-text">"${review.text.slice(0, 100)}${review.text.length > 100 ? '…' : ''}"</p>
      <div class="rv-scroll-author">
        <div class="rv-scroll-avatar" style="background:${avatarColor(review.name)}">${initials(review.name)}</div>
        <span>${review.name}</span>
      </div>
    </div>`;
}

function renderScrollStrip() {
  const positives = getMergedPositive();
  ['rvStrip1','rvStrip2'].forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    // Duplicate content for seamless loop
    const html = positives.map(buildScrollItem).join('');
    el.innerHTML = html + html;
  });
}

// ── REVIEW FORM ───────────────────────────────────────────────────

let formRating = 0;

function initStarInput() {
  const stars = document.querySelectorAll('.star-input');
  stars.forEach(star => {
    star.addEventListener('mouseover', () => highlightStars(+star.dataset.val));
    star.addEventListener('mouseleave', () => highlightStars(formRating));
    star.addEventListener('click', () => {
      formRating = +star.dataset.val;
      highlightStars(formRating);
      document.getElementById('ratingVal').value = formRating;
    });
  });
}

function highlightStars(count) {
  document.querySelectorAll('.star-input').forEach((s, i) => {
    s.classList.toggle('active', i < count);
  });
}

function handleReviewSubmit(e) {
  e.preventDefault();
  const name   = document.getElementById('rvName').value.trim();
  const text   = document.getElementById('rvText').value.trim();
  const rating = parseInt(document.getElementById('ratingVal').value);

  if (!name || !text || !rating) {
    showFormError('Please fill all fields and select a star rating.');
    return;
  }
  if (text.length < 20) {
    showFormError('Please write at least 20 characters.');
    return;
  }

  const review = { id: uid(), name, rating, text, timestamp: new Date().toISOString() };
  pushReview(review);

  // Reset form
  e.target.reset();
  formRating = 0;
  highlightStars(0);
  document.getElementById('ratingVal').value = '';

  // Show success
  const successEl = document.getElementById('rvSuccess');
  successEl.classList.add('visible');
  setTimeout(() => successEl.classList.remove('visible'), 4000);

  // Re-render
  carouselIndex = 0;
  renderCarousel();
  renderScrollStrip();
  resetCarouselAuto();
}

function showFormError(msg) {
  const el = document.getElementById('rvError');
  el.textContent = msg;
  el.classList.add('visible');
  setTimeout(() => el.classList.remove('visible'), 3500);
}

// ── INIT ─────────────────────────────────────────────────────────

function initReviews() {
  renderCarousel();
  renderScrollStrip();
  initCarouselSwipe();
  resetCarouselAuto();
  initStarInput();

  const form = document.getElementById('rvForm');
  if (form) form.addEventListener('submit', handleReviewSubmit);

  // Show stack info
  updateStackInfo();
}

function updateStackInfo() {
  const el = document.getElementById('rvStackInfo');
  if (!el) return;
  const stacks = getAllStacks();
  const total  = stacks.flat().length;
  const idx    = Math.max(0, stacks.length - 1);
  const used   = stacks[idx]?.length ?? 0;
  el.textContent = `Stack #${idx} · ${used}/${STACK_SIZE} used · ${total} total reviews stored`;
}

// Auto-init on DOMContentLoaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initReviews);
} else {
  initReviews();
}
