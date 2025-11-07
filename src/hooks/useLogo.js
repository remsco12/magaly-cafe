// src/hooks/useLogo.js
import { useState, useEffect } from 'react'

export const useLogo = () => {
  const [logoSrc, setLogoSrc] = useState(null)

  useEffect(() => {
    // Essayer de charger le logo
    const img = new Image()
    img.src = '/logo.png'
    
    img.onload = () => {
      setLogoSrc('/logo.png')
    }
    
    img.onerror = () => {
      setLogoSrc(null) // Utiliser le fallback
    }
  }, [])

  return logoSrc
}