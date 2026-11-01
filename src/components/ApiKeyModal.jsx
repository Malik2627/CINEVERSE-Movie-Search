import React, { useState } from 'react';
import { X, Key, ExternalLink, Check, ShieldCheck } from 'lucide-react';
import { useMovieContext } from '../context/MovieContext';

export default function ApiKeyModal() {
  const { isApiKeyModalOpen, setIsApiKeyModalOpen, apiKey, updateApiKey } = useMovieContext();
  const [inputValue, setInputValue] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isApiKeyModalOpen) return null;

  const handleSave = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    updateApiKey(inputValue.trim());
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      setIsApiKeyModalOpen(false);
      window.location.reload();
    }, 700);
  };

  const handleClear = () => {
    updateApiKey('');
    setInputValue('');
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      setIsApiKeyModalOpen(false);
      window.location.reload();
    }, 700);
  };

  return (
    <div className="modal-backdrop" onClick={() => setIsApiKeyModalOpen(false)}>
      <div
        className="modal-card"
        style={{ maxWidth: '520px', padding: '2rem' }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="modal-close-btn"
          onClick={() => setIsApiKeyModalOpen(false)}
        >
          <X size={20} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
          <div className="logo-icon-wrap" style={{ width: '38px', height: '38px' }}>
            <Key size={18} />
          </div>
          <h2 style={{ fontSize: '1.4rem' }}>TMDB API Settings</h2>
        </div>

        {apiKey ? (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.85rem 1rem',
              borderRadius: '12px',
              background: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              marginBottom: '1.25rem',
              color: '#34d399',
              fontSize: '0.9rem',
            }}
          >
            <ShieldCheck size={20} />
            <span>TMDB API Key is configured and securely loaded.</span>
          </div>
        ) : (
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '1.25rem' }}>
            Connect your TMDB API key to search live movies, stream trailers, and fetch official cast and metadata.
          </p>
        )}

        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '600', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>
              {apiKey ? 'Override or Update API Key' : 'Enter TMDB API Key (v3)'}
            </label>
            <div className="search-input-box">
              <Key size={18} color="var(--accent-purple)" />
              <input
                type="password"
                placeholder={apiKey ? '••••••••••••••••••••••••••••••••' : 'Enter 32-character key'}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                autoComplete="off"
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button
              type="submit"
              className="btn-primary"
              style={{ flex: 1, justifyContent: 'center' }}
              disabled={!inputValue.trim()}
            >
              {savedSuccess ? <Check size={18} /> : null}
              <span>{savedSuccess ? 'Updated & Reloading...' : 'Save Key'}</span>
            </button>
            {apiKey && (
              <button
                type="button"
                className="btn-secondary"
                onClick={handleClear}
                style={{ padding: '0.85rem 1rem' }}
              >
                Clear Custom Key
              </button>
            )}
          </div>
        </form>

        <div
          style={{
            marginTop: '1.5rem',
            padding: '1rem',
            borderRadius: '12px',
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid var(--border-subtle)',
            fontSize: '0.82rem',
            color: 'var(--text-muted)',
            lineHeight: '1.5',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-primary)', marginBottom: '0.4rem', fontWeight: '600' }}>
            <ExternalLink size={14} /> Need an API Key?
          </div>
          Create a free account at{' '}
          <a
            href="https://www.themoviedb.org/signup"
            target="_blank"
            rel="noreferrer"
            style={{ color: 'var(--accent-blue)', textDecoration: 'underline' }}
          >
            themoviedb.org
          </a>{' '}
          and request an API key in your Account Settings. You can also configure <code>VITE_TMDB_API_KEY</code> inside <code>.env</code>.
        </div>
      </div>
    </div>
  );
}
