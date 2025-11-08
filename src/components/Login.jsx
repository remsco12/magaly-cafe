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
  const [users, setUsers] = useState([])

  // Charger les utilisateurs au démarrage
  useEffect(() => {
    const initializedUsers = userManager.initializeUsers()
    setUsers(initializedUsers)
    console.log('Utilisateurs initialisés:', initializedUsers)
  }, [])

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
        console.log('Tentative de connexion échouée:', username)
        console.log('Utilisateurs disponibles:', users)
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

  // Comptes de démonstration
  const demoAccounts = [
    { username: 'hyperadmin', password: 'hyperadmin123', role: '🚨 Hyper Admin' },
    { username: 'admin', password: 'admin123', role: '⚙️ Admin' },
    { username: 'gerant', password: 'gerant123', role: '👔 Gérant' },
    { username: 'serveur', password: 'serveur123', role: '☕ Serveur' }
  ]

  const fillDemoAccount = (account) => {
    setUsername(account.username)
    setPassword(account.password)
    toast.success(`Compte ${account.role} rempli !`)
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
            <div className="coffee-icon">☕</div>
            <div className="logo-text">
              <h1>Magaly Café</h1>
              <p>Système de Gestion Professionnelle</p>
            </div>
          </div>
        </div>

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-title">
            <h2>Connexion</h2>
            <p>Accédez à votre espace de travail</p>
          </div>

          {/* Champ nom d'utilisateur */}
          <div className="input-group">
            <div className="input-container">
              <User className="input-icon" size={20} />
              <input
                type="text"
                className="login-input"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Nom d'utilisateur"
                required
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Champ mot de passe */}
          <div className="input-group">
            <div className="input-container">
              <Lock className="input-icon" size={20} />
              <input
                type={showPassword ? "text" : "password"}
                className="login-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mot de passe"
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
                Connexion...
              </>
            ) : (
              'Se connecter'
            )}
          </button>
        </form>

        {/* Comptes de démonstration avec boutons */}
        <div className="login-help">
          <p><strong>Comptes de démonstration :</strong></p>
          <div className="demo-accounts-grid">
            {demoAccounts.map((account, index) => (
              <button
                key={index}
                type="button"
                className="demo-account-btn"
                onClick={() => fillDemoAccount(account)}
                disabled={isLoading}
              >
                <span className="demo-role">{account.role}</span>
                <span className="demo-credentials">
                  {account.username} / {account.password}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="login-footer">
          <div className="security-info">
            <Shield className="security-icon" size={16} />
            <span>Système sécurisé</span>
          </div>
          <div className="version-info">
            v1.0.0
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login