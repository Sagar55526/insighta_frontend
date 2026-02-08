# 🌌 Insighta Frontend

Welcome to the **Insighta Frontend**, a state-of-the-art data intelligence platform built with **React 19**, **Vite**, and **Tailwind CSS 4**. Insighta empowers users to extract deep insights from their datasets through an intuitive, AI-driven chat interface and high-fidelity visualizations.

---

## ✨ Key Features

- **🔐 Secure Authentication**: Full JWT-based user authentication system with secure persistent sessions.
- **🚀 Intelligent Ingestion**: Seamlessly upload `PDF`, `CSV`, and `TXT` datasets with real-time progress tracking and semantic processing.
- **💬 Neural Chat Interface**: A premium chat experience featuring "Chain of Thought" processing displays and real-time streaming responses.
- **📊 Schema Management**: Interactive schema editor to view and refine the intelligence mapping of your uploaded datasets.
- **💎 Premium Aesthetics**: Modern, responsive UI with glassmorphism effects, smooth micro-animations, and a curated color palette.

---

## 🛠️ Tech Stack

- **Core**: [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Networking**: [Axios](https://axios-http.com/)
- **Routing**: [React Router 7](https://reactrouter.com/)
- **Markdown**: [React Markdown](https://github.com/remarkjs/react-markdown) + [Remark GFM](https://github.com/remarkjs/remark-gfm)

---

## 🚦 Getting Started

### Prerequisites

Ensure you have the following installed on your local machine:
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Sagar55526/insighta_frontend.git
   cd insighta_frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Environment Configuration**:
   Create a `.env` file in the root directory (using `.env.example` as a template if available, or create from scratch):
   ```env
   VITE_API_URL=http://localhost:8000
   VITE_WS_URL=ws://localhost:8000
   ```

### Development

Start the local development server:
```bash
npm run dev
```
The application will be available at `http://localhost:3000`.

### Production

To build the application for production:
```bash
npm run build
```
The optimized bundle will be generated in the `dist/` directory.

---

## 📂 Project Structure

```text
src/
├── components/      # Functional UI components
│   ├── auth/        # Login and Registration pages
│   ├── chat/        # Message list, input, and thread sidebar
│   ├── common/      # Reusable UI elements (Button, Input, etc.)
│   ├── layout/      # Page shell and navigation (TopBar, Layouts)
│   ├── schema/      # Schema editor and management
│   └── upload/      # File ingestion and progress tracking
├── context/         # React Context for global state (Auth)
├── hooks/           # Custom React hooks (useAuth, useMessages)
├── services/        # API and WebSocket service layers
├── utils/           # Helper functions and constants
└── App.jsx          # Main application routing and entry point
```

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:
1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request


---


*Crafted with 💜 by Sagar Ahire*