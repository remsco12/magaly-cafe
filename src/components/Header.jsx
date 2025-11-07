import React from 'react'
import { LogOut } from 'lucide-react'

const Header = ({ user, onLogout, showLogout = true }) => {
  return (
    <header className="app-header">
      <div className="header-content">
        <div className="logo">
          <div style={{
            position: 'relative',
            width: '50px',
            height: '50px',
            marginRight: '15px'
          }}>
            {/* Fallback toujours visible */}
            <div style={{
              width: '100%',
              height: '100%',
              background: 'linear-gradient(135deg, #8B4513 0%, #D2691E 100%)',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '20px',
              fontWeight: 'bold'
            }}>
              ☕
            </div>
            
            {/* Logo qui se superpose si disponible */}
            <img 
              src="/logo.png" 
              alt="Magaly Café" 
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                borderRadius: '8px'
              }}
              onError={(e) => {
                e.target.style.display = 'none'
              }}
            />
          </div>
          
          <div className="logo-text">
            <h1>Magaly Café</h1>
            <span className="logo-subtitle">Gestion Professionnelle</span>
          </div>
        </div>
        
        {showLogout && user && (
          <div className="header-actions">
            <span className="welcome">
              Bienvenue, {user.username} ({user.role})
            </span>
            <button onClick={onLogout} className="logout-btn">
              <LogOut size={16} />
              Déconnexion
            </button>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header