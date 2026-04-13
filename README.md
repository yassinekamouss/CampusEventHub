# 🚀 CampusEventHub

**CampusEventHub** is a high-performance, professional event management platform designed for university ecosystems. It bridges the gap between student engagement and administrative efficiency through a seamless, real-time mobile experience.

Built with a "Performance-First" mindset, the app utilizes a modern tech stack to ensure scalability, security, and a premium user experience inspired by the **ThinkPad X1 Carbon** aesthetic.

---

## ✨ Core Features

### 🔐 Authentication & RBAC (Role-Based Access Control)
* **Student Access:** Discover, search, and register for campus events.
* **Admin Power-Panel:** Secure dashboard for event creation, attendee management, and real-time analytics.
* **Seamless Onboarding:** Validated registration and login flow powered by Supabase Auth.

### 📅 Event Management
* **Real-time Sync:** Instant updates using TanStack Query for a lag-free UI.
* **Advanced Validation:** Robust form handling with React Hook Form and Zod schemas.
* **Rich UI:** Smooth transitions and high-performance lists using FlashList and Reanimated.

---

## 🛠 Tech Stack

| Category           | Technology                                                                 |
|--------------------|----------------------------------------------------------------------------|
| **Framework** | React Native (Expo SDK 50+)                                               |
| **Language** | TypeScript                                                                 |
| **Backend / Auth** | Supabase (PostgreSQL, Auth, Storage)                                      |
| **State / Cache** | TanStack Query (React Query)                                              |
| **Navigation** | Expo Router (File-based routing)                                          |
| **Styling** | React Native StyleSheet (ThinkPad Dark Theme)                             |
| **Animations** | React Native Reanimated                                                   |

---

## 🏗 Architecture

The project follows a modular and scalable directory structure:

```text
├── app/                  # Expo Router directory (File-based navigation)
│   ├── (admin)/          # Protected administrative routes
│   ├── (auth)/           # Authentication flows (Login/Register)
│   ├── (tabs)/           # Student main navigation
│   └── _layout.tsx       # Global Providers (Auth, QueryClient)
├── components/           # Reusable UI components
├── services/             # API & Supabase service definitions
├── store/                # Context API & Global state management
├── utils/                # Helper functions & Zod schemas
└── constants/            # Theme colors & configuration
```

## 🚀 Getting Started
### Prerequisites

- Node.js & npm

- Expo Go app on your physical device

### Installation
1. Clone the repository:
```bash
git clone https://github.com/yassinekamouss/CampusEventHub.git
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the root directory:
```bash
EXPO_PUBLIC_SUPABASE_URL=[https://your-project-id.supabase.co](https://your-project-id.supabase.co)
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

4. Start the development server:
```bash
npx expo start -c
```

## 🎨 Aesthetic & Design
The application features a **Premium Dark Mode** theme:

- `Background`: #121212 (Deep Black)

- `Surface`: #1E1E1E (Anthracite)

- `Accent`: #0066CC (Electric Blue)

- `Typography`: Clean, high-contrast sans-serif.

## Author
**Yassine Kamouss** Software Engineering Student at FST Tanger