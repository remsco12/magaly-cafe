import React, { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import { User, Lock, Eye, EyeOff, Shield } from 'lucide-react'
import { userManager } from '../utils/userManager'
import '../styles/Login.css'

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!username || !password) {
      toast.error('Veuillez remplir tous les champs')
      return
    }

    setIsLoading(true)

    // Simuler un délai de chargement
    await new Promise(resolve => setTimeout(resolve, 500))

    try {
      // Authentifier l'utilisateur
      const user = userManager.authenticate(username, password)
      
      if (user) {
        userManager.setCurrentUser(user)
        onLogin(user)
        toast.success(`Bienvenue ${user.name} !`)
      } else {
        toast.error('Identifiants incorrects')
      }
    } catch (error) {
      console.error('Erreur lors de la connexion:', error)
      toast.error('Erreur lors de la connexion')
    }

    setIsLoading(false)
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  return (
    <div className="login-container">
      {/* Background avec effet café */}
      <div className="login-background"></div>
      <div className="background-overlay"></div>
      <div className="coffee-beans"></div>

      {/* Carte de connexion */}
      <div className="login-card">
        {/* Header avec logo */}
        <div className="login-header">
          <div className="logo-container">
            <div style={{
              position: 'relative',
              width: '80px',
              height: '80px',
              marginBottom: '1rem'
            }}>
              {/* Fallback toujours visible */}
              <div style={{
                width: '100%',
                height: '100%',
                background: 'linear-gradient(135deg, #8B4513 0%, #D2691E 100%)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '32px',
                fontWeight: 'bold',
                boxShadow: '0 8px 25px rgba(139, 69, 19, 0.4)',
                border: '3px solid rgba(255, 255, 255, 0.3)'
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
                  borderRadius: '50%',
                  padding: '8px'
                }}
                onError={(e) => {
                  e.target.style.display = 'none'
                }}
              />
            </div>
            
            <div className="logo-text">
              <h1>Magaly Café</h1>
              <p>Gestion Professionnelle</p>
            </div>
          </div>
        </div>

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-title">
            <h2>Connexion Système</h2>
            <p>Identifiez-vous pour accéder au tableau de bord</p>
          </div>

          {/* Champ nom d'utilisateur */}
          <div className="input-group">
            <label className="input-label">Nom d'utilisateur</label>
            <div className="input-container">
              <User className="input-icon" size={20} />
              <input
                type="text"
                className="login-input"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Votre nom d'utilisateur"
                required
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Champ mot de passe */}
          <div className="input-group">
            <label className="input-label">Mot de passe</label>
            <div className="input-container">
              <Lock className="input-icon" size={20} />
              <input
                type={showPassword ? "text" : "password"}
                className="login-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Votre mot de passe"
                required
                disabled={isLoading}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={togglePasswordVisibility}
                disabled={isLoading}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Bouton de connexion */}
          <button 
            type="submit" 
            className="login-btn"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="loading-spinner"></div>
                Connexion en cours...
              </>
            ) : (
              'Se connecter'
            )}
          </button>
        </form>

        {/* Informations de connexion discrètes */}
        <div className="login-info">
          <div className="info-item">
            <strong>Hyper Admin:</strong> hyperadmin / hyperadmin123
          </div>
          <div className="info-item">
            <strong>Admin:</strong> admin / admin123
          </div>
          <div className="info-item">
            <strong>Gérant:</strong> gerant / gerant123
          </div>
          <div className="info-item">
            <strong>Serveur:</strong> serveur / serveur123
          </div>
        </div>

        {/* Footer */}
        <div className="login-footer">
          <div className="security-info">
            <Shield className="security-icon" size={16} />
            <span>Accès sécurisé</span>
          </div>
          <div className="version-info">
            Magaly Café v1.0
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login