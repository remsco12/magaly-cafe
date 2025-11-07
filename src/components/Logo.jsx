// src/components/Logo.jsx
import React from 'react'

const Logo = () => {
  return (
    <div className="logo-container">
      {/* Fallback stylisé qui s'affichera toujours */}
      <div className="logo-fallback">
        <span style={{ fontSize: '24px' }}>☕</span>
      </div>
      
      {/* Logo image qui se superpose si disponible */}
      <img 
        src="/logo.png" 
        alt="Magaly Café" 
        className="logo-image"
        style={{
          position: 'absolute',
          top: 0,
          left: 0
        }}
        onError={(e) => {
          e.target.style.display = 'none'
        }}
      />
    </div>
  )
}

export default Logo