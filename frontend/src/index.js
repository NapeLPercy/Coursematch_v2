import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";

import { HelmetProvider } from "react-helmet-async";
import { CookieConsentProvider } from "./context/CookieConsentContext";
import QueryProvider from "./providers/QueryProvider";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <HelmetProvider>
    <CookieConsentProvider>
      <QueryProvider>
        <App />
      </QueryProvider>
    </CookieConsentProvider>
  </HelmetProvider>,
);
