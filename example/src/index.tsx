import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { MooApp } from "@andrewmclachlan/mooapp";
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <MooApp clientId="596dfa38-50f8-4b83-8513-dfd3473d2072">
    <App />
  </MooApp>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
