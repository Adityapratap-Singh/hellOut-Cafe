# 🔥 Hell Out Cafe — Official Website

> Charcoal Baked Pizza · Burgers · Rolls · Coffee | Chakan, Maharashtra

A fully responsive, multi-page static website for **Hell Out Cafe** — a premium street-food cafe in Sara City, Chakan. Built with vanilla HTML, CSS, and JavaScript. No frameworks. No dependencies.

---

## 🌐 Live Site

> Open `src/index.html` in any modern browser — no build step required.

---

## 📄 Pages

| Page | File | Description |
|------|------|-------------|
| **Home** | `src/index.html` | Hero, categories, specials, review carousel, CTA |
| **Menu** | `src/menu.html` | Full menu with horizontal scroll filter bar |
| **About** | `src/about.html` | Story, values, charcoal baking process |
| **Contact** | `src/contact.html` | Map, hours, WhatsApp, Swiggy & Zomato links |

---

## ✨ Features

- 🔥 **Flame loader** — animated fire intro on every page load
- 🍕 **Full menu** — 40+ items across 10 categories with prices
- 🎠 **Review carousel** — horizontal sideways scroll, active card centered & enlarged
- ⭐ **User reviews** — submit your own review; stored in `localStorage` stacks (10/stack → auto-creates next)
- 📜 **Infinite review strip** — positive reviews (4★+) auto-scroll in two directions
- 🔍 **Menu filter bar** — horizontal scroll strip, active button snaps to center
- 🌯 **Swiggy & Zomato** order links throughout (navbar, hero, CTAs, footer)
- 💬 **WhatsApp float button** — pulsing, with tooltip
- 📱 **Sticky mobile order bar** — Swiggy + Zomato + Call, pinned to bottom on mobile
- 🗺️ **Real Google Maps embed** — verified Hell Out pin
- 📸 **Infinite image gallery** — dual-row scroll in opposite directions (pausable on hover)
- 🎨 **Dark fire theme** — charcoal, fire-orange, ember-gold palette

---

## 🗂️ File Structure

```
├── src/
│   ├── index.html        # Homepage
│   ├── menu.html         # Full menu page
│   ├── about.html        # About us page
│   ├── contact.html      # Contact & location page
│   ├── styles.css        # Complete stylesheet (~55KB)
│   ├── script.js         # Main JS (nav, loader, reveal, filter, transitions)
│   ├── reviews.js        # Review engine (localStorage stacks, carousel, form)
│   └── images/
│       ├── logo.png
│       ├── hero_pizza.png
│       ├── cafe_interior.png
│       ├── coffee.png
│       ├── burger.png
│       └── charcoal_oven.png
└── README.md
```

---

## 🛠️ Tech Stack

- **HTML5** — semantic, SEO-optimised
- **CSS3** — custom properties, glassmorphism, animations, CSS Grid & Flexbox
- **Vanilla JavaScript** — no libraries or frameworks
- **localStorage** — client-side review storage with stack architecture
- **Google Fonts** — Bebas Neue, Cinzel, Inter

---

## 📦 Review Storage Architecture

Reviews are stored in `localStorage` using an auto-growing stack system:

```
hellout_reviews_stack_0  →  10 reviews (full)
hellout_reviews_stack_1  →  10 reviews (full)
hellout_reviews_stack_2  →  ...ongoing
```

- Stack size: **10 reviews per stack**
- When a stack fills up, a new stack is created automatically
- Positive reviews (rating ≥ 4★) feed the infinite scroll strip
- 6 seed reviews are pre-loaded in memory (not persisted)

---

## 📍 Location

**Kad Bandhu Road, Sara City, Chakan, Maharashtra**

- 📞 [+91 77588 43586](tel:7758843586)
- 🛵 [Order on Swiggy](https://www.swiggy.com/menu/1256969?source=sharing)
- 🍽️ [Order on Zomato](https://zomato.onelink.me/xqzv/1r7y80zx)
- 🕐 Open Daily: 3:00 PM – 9:30 PM

---

## 📸 Design Highlights

- Dark charcoal background (`#0D0D0D`) with fire-orange accents (`#FF6B00`)
- Bebas Neue for display, Cinzel for headings, Inter for body
- Scroll-reveal animations via Intersection Observer API
- Fire particle effect on hero section
- Page transition overlay between pages

---

*Made with 🔥 in Chakan*
