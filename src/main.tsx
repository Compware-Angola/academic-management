import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import App2 from "./App2.tsx";

const REFACTOR_ROUTER = "YES_REFACTOR_ROUTER"
createRoot(document.getElementById("root")!).render(REFACTOR_ROUTER === "YES_REFACTOR_ROUTER" ? <App2 /> : <App />);
