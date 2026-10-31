import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import App from './App.jsx';
import './index.css';
import store from './store/index.js';
import StatsWatcher from './wathcers/StatsWatcher.jsx';

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <StatsWatcher />

    <App />
  </Provider>
);
