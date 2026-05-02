/* =============================================
   MIYA KEBABS – app.js
   ============================================= */

// ===== NAVBAR SCROLL =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
  updateActiveLink();
});

// ===== HAMBURGER =====
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});
navLinks.querySelectorAll('.nav-link').forEach(l => {
  l.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

// ===== ACTIVE NAV LINK =====
function updateActiveLink() {
  const sections = ['home','featured','menu','gallery','about','contact'];
  const scrollY = window.scrollY + 120;
  sections.forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    const link = document.querySelector(`.nav-link[href="#${id}"]`);
    if (!link) return;
    const top = el.offsetTop, bot = top + el.offsetHeight;
    link.classList.toggle('active', scrollY >= top && scrollY < bot);
  });
}

// ===== REVEAL ON SCROLL =====
const revealObserver = new IntersectionObserver(
  (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
  { threshold: 0.12 }
);
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ===== MENU DATA =====
const menuItems = [
  // Kebabs
  { cat: 'kebabs', emoji: '🍢', name: 'Seekh Kebab', desc: 'Juicy minced chicken kebab with Mumbai-style masala, cooked on live charcoal', price: '₹160', veg: false, tag: 'bestseller' },
  { cat: 'kebabs', emoji: '🍢', name: 'Chapli Kebab', desc: 'Flat-style minced kebab with coriander, green chilli & onion', price: '₹180', veg: false, tag: '' },
  { cat: 'kebabs', emoji: '🥩', name: 'Shami Kebab', desc: 'Slow-cooked lentil & chicken patty — melt in your mouth', price: '₹150', veg: false, tag: '' },
  { cat: 'kebabs', emoji: '🌿', name: 'Hara Bhara Kebab', desc: 'Spinach, peas & paneer patty with green chutney', price: '₹130', veg: true, tag: '' },
  // Shawarmas
  { cat: 'shawarmas', emoji: '🌯', name: 'Chicken Shawarma', desc: 'Grilled chicken in lavash with garlic sauce, pickles & fresh veggies', price: '₹120', veg: false, tag: 'bestseller' },
  { cat: 'shawarmas', emoji: '🌯', name: 'Double Meat Shawarma', desc: 'Extra chicken with extra garlic sauce — the ultimate wrap', price: '₹160', veg: false, tag: '' },
  { cat: 'shawarmas', emoji: '🌯', name: 'Peri Peri Shawarma', desc: 'Fiery peri peri chicken shawarma with crunchy slaw', price: '₹140', veg: false, tag: '' },
  { cat: 'shawarmas', emoji: '🌯', name: 'Falafel Shawarma', desc: 'Crispy falafel, hummus, tahini & fresh salad in lavash', price: '₹110', veg: true, tag: '' },
  // Rolls
  { cat: 'rolls', emoji: '🫔', name: 'Chicken Tikka Roll', desc: 'Smoky tikka chunks with onion, chutney in a lachha paratha roll', price: '₹130', veg: false, tag: 'bestseller' },
  { cat: 'rolls', emoji: '🫔', name: 'Seekh Kebab Roll', desc: 'Seekh kebab roll with pickled onions and mint chutney', price: '₹140', veg: false, tag: '' },
  { cat: 'rolls', emoji: '🫔', name: 'Paneer Tikka Roll', desc: 'Tandoori paneer cubes in a crispy paratha roll', price: '₹120', veg: true, tag: '' },
  { cat: 'rolls', emoji: '🫔', name: 'Egg Mughlai Roll', desc: 'Classic Mughlai egg roll with onion, green chilli & chutney', price: '₹90', veg: false, tag: '' },
  // Tandoori
  { cat: 'tandoori', emoji: '🍗', name: 'Chicken Tikka', desc: 'Tender marinated chicken tikka from the live tandoor', price: '₹180', veg: false, tag: 'bestseller' },
  { cat: 'tandoori', emoji: '🍗', name: 'Changezi Chicken', desc: 'Mughlai cream & tomato gravy with tandoor-roasted chicken', price: '₹250', veg: false, tag: '' },
  { cat: 'tandoori', emoji: '🧀', name: 'Paneer Tikka', desc: 'Charred paneer cubes with capsicum & onion', price: '₹170', veg: true, tag: '' },
  { cat: 'tandoori', emoji: '🍗', name: 'Tandoori Chicken (Half)', desc: 'Classic whole chicken marinated overnight, roasted in tandoor', price: '₹220', veg: false, tag: '' },
];

function renderMenu(filter = 'all') {
  const grid = document.getElementById('menuGrid');
  const items = filter === 'all' ? menuItems : menuItems.filter(i => i.cat === filter);
  grid.innerHTML = items.map(item => `
    <div class="menu-item">
      <div class="menu-item-emoji">${item.emoji}</div>
      <div class="menu-item-info">
        <h4>${item.name}</h4>
        <p>${item.desc}</p>
        <div class="menu-item-footer">
          <span class="menu-price">${item.price}</span>
          ${item.veg ? '<span class="menu-tag tag-veg">🌿 Veg</span>' : ''}
          ${item.tag === 'bestseller' ? '<span class="menu-tag tag-bestseller">★ Best Seller</span>' : ''}
        </div>
      </div>
    </div>
  `).join('');
}

renderMenu();

document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderMenu(btn.dataset.cat);
  });
});

// ===== TESTIMONIAL SLIDER =====
const track  = document.getElementById('testimonialTrack');
const cards  = track ? track.querySelectorAll('.testimonial-card') : [];
const dotsWrap = document.getElementById('sliderDots');
let current = 0, autoTimer;

function getCardWidth() {
  if (!cards.length) return 0;
  return cards[0].getBoundingClientRect().width + 24;
}

function goTo(idx) {
  current = (idx + cards.length) % cards.length;
  track.style.transform = `translateX(-${current * getCardWidth()}px)`;
  dotsWrap.querySelectorAll('.dot').forEach((d,i) => d.classList.toggle('active', i === current));
}

if (cards.length && dotsWrap) {
  cards.forEach((_, i) => {
    const dot = document.createElement('div');
    dot.className = 'dot' + (i === 0 ? ' active' : '');
    dot.addEventListener('click', () => { goTo(i); resetAuto(); });
    dotsWrap.appendChild(dot);
  });
  document.getElementById('prevBtn').addEventListener('click', () => { goTo(current - 1); resetAuto(); });
  document.getElementById('nextBtn').addEventListener('click', () => { goTo(current + 1); resetAuto(); });
  function resetAuto() { clearInterval(autoTimer); autoTimer = setInterval(() => goTo(current + 1), 4500); }
  resetAuto();
  window.addEventListener('resize', () => goTo(current));
}

// ===== GALLERY FILTER =====
const galleryItems = document.querySelectorAll('.gallery-item');

document.querySelectorAll('.gtab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.gtab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const cat = btn.dataset.gcat;
    galleryItems.forEach(item => {
      const show = cat === 'all' || item.dataset.gcat === cat;
      item.classList.toggle('hidden', !show);
    });
  });
});

// ===== LIGHTBOX =====
const lightbox     = document.getElementById('lightbox');
const lightboxImg  = document.getElementById('lightboxImg');
const lightboxClose = document.getElementById('lightboxClose');

galleryItems.forEach(item => {
  item.addEventListener('click', () => {
    const src = item.querySelector('img').src;
    lightboxImg.src = src;
    lightbox.classList.add('open');
  });
});
lightboxClose.addEventListener('click', () => lightbox.classList.remove('open'));
lightbox.addEventListener('click', e => { if (e.target === lightbox) lightbox.classList.remove('open'); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') lightbox.classList.remove('open'); });

// ===== CONTACT FORM =====
function handleForm(e) {
  e.preventDefault();
  const success = document.getElementById('formSuccess');
  success.classList.add('show');
  e.target.reset();
  setTimeout(() => success.classList.remove('show'), 4000);
}

// ===== SMOOTH ACTIVE NAV ON LOAD =====
updateActiveLink();
