import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

// Self-hosted fonts
import "@fontsource/inter";
import "@fontsource/inter/300.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";
import "@fontsource/inter/800.css";
import "@fontsource/inter/900.css";

import "@fontsource/playfair-display";
import "@fontsource/playfair-display/500.css";
import "@fontsource/playfair-display/600.css";
import "@fontsource/playfair-display/700.css";
import "@fontsource/playfair-display/800.css";
import "@fontsource/playfair-display/900.css";

import "@fontsource/eb-garamond";
import "@fontsource/eb-garamond/500.css";
import "@fontsource/eb-garamond/600.css";
import "@fontsource/eb-garamond/700.css";
import "@fontsource/eb-garamond/800.css";

import "@fontsource/dm-sans";
import "@fontsource/dm-sans/300.css";
import "@fontsource/dm-sans/500.css";
import "@fontsource/dm-sans/600.css";
import "@fontsource/dm-sans/700.css";

import "@fontsource/dm-serif-display";

import "@fontsource/poppins";
import "@fontsource/poppins/300.css";
import "@fontsource/poppins/500.css";
import "@fontsource/poppins/600.css";
import "@fontsource/poppins/700.css";
import "@fontsource/poppins/800.css";

import "@fontsource/cormorant-garamond";
import "@fontsource/cormorant-garamond/300.css";
import "@fontsource/cormorant-garamond/500.css";
import "@fontsource/cormorant-garamond/600.css";
import "@fontsource/cormorant-garamond/700.css";

import "@fontsource/lato";
import "@fontsource/lato/300.css";
import "@fontsource/lato/700.css";
import "@fontsource/lato/900.css";

import "@fontsource/merriweather";
import "@fontsource/merriweather/300.css";
import "@fontsource/merriweather/700.css";
import "@fontsource/merriweather/900.css";

import "@fontsource/libre-baskerville";
import "@fontsource/libre-baskerville/700.css";

import "@fontsource/montserrat";
import "@fontsource/montserrat/300.css";
import "@fontsource/montserrat/500.css";
import "@fontsource/montserrat/600.css";
import "@fontsource/montserrat/700.css";
import "@fontsource/montserrat/800.css";

import "@fontsource/raleway";
import "@fontsource/raleway/300.css";
import "@fontsource/raleway/500.css";
import "@fontsource/raleway/600.css";
import "@fontsource/raleway/700.css";

import "@fontsource/josefin-sans";
import "@fontsource/josefin-sans/300.css";
import "@fontsource/josefin-sans/600.css";
import "@fontsource/josefin-sans/700.css";

import "@fontsource/crimson-pro";
import "@fontsource/crimson-pro/600.css";
import "@fontsource/crimson-pro/700.css";

import "@fontsource/source-sans-3";
import "@fontsource/source-sans-3/300.css";
import "@fontsource/source-sans-3/600.css";
import "@fontsource/source-sans-3/700.css";

import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
