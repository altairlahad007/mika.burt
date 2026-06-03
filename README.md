# React + Vite Boilerplate

Modern React 18 + Vite 5 with GSAP animations and Lenis smooth scroll.

## Tech Stack

- **React 18** — Functional components with hooks
- **Vite 5** — Fast dev server and optimized builds
- **GSAP 3** — Professional-grade animations (ScrollTrigger, SplitText)
- **Lenis** — Smooth scroll with momentum
- **CSS Modules** — Scoped styles with BEM naming

## Project Structure

```
src/
├── main.jsx              # Entry point
├── App.jsx               # Root component
├── index.css             # Global styles & CSS variables
├── styles/
│   ├── reset.css         # Modern CSS reset
│   └── variables.css     # Design tokens
├── components/
│   ├── Layout/
│   │   └── Layout.jsx    # Main layout wrapper
│   ├── Header/
│   │   └── Header.jsx    # Sticky header
│   ├── Hero/
│   │   └── Hero.jsx      # Animated hero section
│   ├── Section/
│   │   └── Section.jsx   # Reusable content section
│   └── Footer/
│       └── Footer.jsx    # Site footer
└── utils/
    └── animations.js     # GSAP animation helpers
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server at localhost:5173 |
| `npm run build` | Create production build |
| `npm run preview` | Preview production build |

## Features

- GSAP ScrollTrigger for scroll-based animations
- Lenis smooth scroll with momentum decay
- Responsive breakpoints: mobile (< 768px), tablet (768px-1024px), desktop (> 1024px)
- CSS custom properties for theming
- Intersection Observer for lazy animations
- Mobile-first responsive approach

## License

MIT