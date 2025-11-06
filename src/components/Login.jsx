import React, { useState } from 'react'
import { User, Lock, Eye, EyeOff } from 'lucide-react'
import { toast } from 'react-hot-toast'
import '../styles/Login.css'

const Login = ({ onLogin }) => {
  const [credentials, setCredentials] = useState({ username: '', password: '' })
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    
    if (!credentials.username || !credentials.password) {
      toast.error('Veuillez remplir tous les champs')
      return
    }

    setIsLoading(true)

    try {
      // Simuler un délai de chargement
      await new Promise(resolve => setTimeout(resolve, 800))

      // Charger les utilisateurs depuis le localStorage
      const savedUsers = JSON.parse(localStorage.getItem('cafeUsers')) || {
        'admin': { password: 'admin123', role: 'admin', name: 'Administrateur' },
        'gerant': { password: 'gerant123', role: 'gerant', name: 'Gérant' },
        'serveur': { password: 'serveur123', role: 'serveur', name: 'Serveur' }
      }

      const user = savedUsers[credentials.username]
      
      if (user && user.password === credentials.password) {
        onLogin({ 
          username: credentials.username, 
          role: user.role,
          name: user.name
        })
        toast.success(`Bienvenue ${user.name} !`)
      } else {
        toast.error('Identifiants incorrects')
      }
    } catch (error) {
      console.error('Erreur lors de la connexion:', error)
      toast.error('Erreur lors de la connexion')
    } finally {
      setIsLoading(false)
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  return (
    <div className="login-container">
      {/* Background avec overlay */}
      <div className="login-background">
        <div className="background-overlay"></div>
        <div className="coffee-beans"></div>
      </div>

      <div className="login-card">
        {/* Header avec logo */}
        <div className="login-header">
          <div className="logo-container">
            <img 
              src="/logo.png" 
              alt="Magaly Café" 
              className="logo-image"
              onError={(e) => {
                // Fallback si le logo n'est pas trouvé
                e.target.style.display = 'none'
                const fallback = e.target.nextSibling
                if (fallback) {
                  fallback.style.display = 'flex'
                }
              }}
            />
            <div className="logo-fallback">
              <div className="coffee-icon">☕</div>
            </div>
            <div className="logo-text">
              <h1>Magaly Café</h1>
              <p>Système de Gestion</p>
            </div>
          </div>
        </div>

        {/* Formulaire */}
        <form onSubmit={handleLogin} className="login-form">
          <div className="form-title">
            <h2>Connexion</h2>
            <p>Accédez à votre espace</p>
          </div>

          <div className="input-group">
            <div className="input-container">
              <User className="input-icon" size={20} />
              <input
                type="text"
                placeholder="Nom d'utilisateur"
                value={credentials.username}
                onChange={(e) => setCredentials({...credentials, username: e.target.value})}
                required
                disabled={isLoading}
                autoComplete="username"
                className="login-input"
              />
            </div>
          </div>

          <div className="input-group">
            <div className="input-container">
              <Lock className="input-icon" size={20} />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Mot de passe"
                value={credentials.password}
                onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                required
                disabled={isLoading}
                autoComplete="current-password"
                className="login-input"
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

        {/* Footer */}
        <div className="login-footer">
          <div className="security-info">
            <div className="security-icon">🔒</div>
            <span>Système sécurisé</span>
          </div>
          <div className="version-info">
            Version 1.0.0
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login