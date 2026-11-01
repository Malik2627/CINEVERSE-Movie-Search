import React from 'react';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import MovieModal from './components/MovieModal';
import WatchlistDrawer from './components/WatchlistDrawer';
import ApiKeyModal from './components/ApiKeyModal';
import Footer from './components/Footer';
import { MovieProvider } from './context/MovieContext';
import './styles/App.css';

export default function App() {
  return (
    <MovieProvider>
      <div className="app-container">
        <Navbar />
        <HomePage />
        <MovieModal />
        <WatchlistDrawer />
        <ApiKeyModal />
        <Footer />
      </div>
    </MovieProvider>
  );
}
