import React, { useState } from 'react';

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!email.endsWith('@ept.ucar.tn')) {
      setError('UNAUTHORIZED DOMAIN: Access restricted to @ept.ucar.tn');
      return;
    }

    if (password !== 'ro_2026') {
      setError('INVALID CREDENTIALS: Verify clinical passkey');
      return;
    }

    onLogin();
  };

  return (
    <div className="login-container">
      <div className="scanline" />
      
      <div className="glass-dark" style={{ width: 400, padding: 40, border: '1px solid var(--border-glass)' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ 
            width: 56, height: 56, background: 'var(--primary)', borderRadius: '12px', 
            display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px'
          }}>
            <span style={{ color: '#000', fontWeight: 900, fontSize: '28px' }}>Δ</span>
          </div>
          <div style={{ fontWeight: 900, fontSize: '24px', letterSpacing: '0.05em', color: '#fff' }}>AETHER</div>
          <div style={{ fontSize: '10px', color: 'var(--primary)', fontWeight: 800, letterSpacing: '0.2em' }}>SURGICAL OPERATING SYSTEM</div>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div>
            <div className="label-v3" style={{ marginBottom: 10 }}>Clinical Email</div>
            <input 
              type="email" 
              className="input-premium" 
              placeholder="name@ept.ucar.tn" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <div className="label-v3" style={{ marginBottom: 10 }}>Access Passkey</div>
            <input 
              type="password" 
              className="input-premium" 
              placeholder="••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && (
            <div style={{ 
              background: 'rgba(255, 77, 77, 0.1)', border: '1px solid var(--danger)', 
              color: 'var(--danger)', padding: '12px', borderRadius: '8px', fontSize: '10px', 
              fontWeight: 700, letterSpacing: '0.05em', textAlign: 'center'
            }}>
              {error}
            </div>
          )}

          <button className="btn-premium btn-premium-primary" style={{ width: '100%', height: 48, marginTop: 10 }}>
            AUTHENTICATE SESSION
          </button>
        </form>

        <div style={{ marginTop: 40, textAlign: 'center', opacity: 0.3 }}>
          <div style={{ fontSize: '8px', fontWeight: 800, letterSpacing: '0.1em' }}>SECURE GATEWAY V4.2.0</div>
          <div style={{ fontSize: '8px', fontWeight: 800, letterSpacing: '0.1em', marginTop: 4 }}>ENCRYPTED END-TO-END CLINICAL DATA</div>
        </div>
      </div>
    </div>
  );
}
