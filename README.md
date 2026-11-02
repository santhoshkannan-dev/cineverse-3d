# 🎬 Cineverse 3D

A next-generation 3D movie ticket booking web application built with **Next.js 15, React 19, Three.js, React Three Fiber v9, Motion, and Lenis**.

---

## ✨ Features

- **🎬 3D Isometric Poster Wall Intro**: Diagonal animated scrolling wall of movie posters with center logo reveal that smoothly flies into the navigation bar.
- **🌌 3D Cylindrical Panorama Hero**: Interactive 3D carousel with inertia drag physics, mouse parallax, glowing moon sphere, downward spotlight beam, realistic inverted floor reflections, and keyboard navigation.
- **💺 Real-time 3D Cinema Hall**: Interactive 3D seat selector with curved screen, starry ceiling, aisle step lights, sweet-spot seat algorithm ("Find Best Seats"), and camera presets (Screen View, Hall Overview, Seat POV).
- **🍿 Complete Booking Pipeline**: 4-step booking wizard (Seat Selection &rarr; Snack Add-ons &rarr; Order Review &amp; Mock Checkout &rarr; Confirmed E-Ticket with Live QR Code).
- **🎫 My Tickets Wallet**: Persistent local storage wallet with live QR code display and ticket cancellation.
- **⚡ Responsive & Mobile Optimized**: Touch-friendly inertia swiping, responsive viewport sizing, and buttery smooth Lenis scrolling.

---

## 🛠 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **UI & Core**: React 19, TypeScript
- **3D & WebGL**: Three.js, `@react-three/fiber` v9, `@react-three/drei` v10
- **Animations**: `motion/react`, CSS Keyframes
- **Smooth Scroll**: Lenis
- **Styling**: Tailwind CSS
- **State Management**: Zustand (with persistent local storage)

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ or 20+
- npm

### Installation

```bash
# Clone the repository
git clone https://github.com/santhoshkannan-dev/cineverse-3d.git
cd cineverse-3d

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## 📦 Build for Production

```bash
npm run build
npm run start
```

---

## 📄 License

MIT
