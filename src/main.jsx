import ReactDOM from 'react-dom/client';
import { Provider } from "react-redux";
import { HashRouter } from "react-router-dom";
import './index.css';
import { Router } from "./routes";
import { store } from "./stores/index.js";

ReactDOM.createRoot(document.getElementById("root")).render(
    <Provider store={store}>
        <HashRouter>
            <Router />
        </HashRouter>
    </Provider>
);
