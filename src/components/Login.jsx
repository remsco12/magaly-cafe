import React, { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import { defaultUsers } from '../data/defaultUsers'
import '../styles/Login.css'

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [users, setUsers] = useState([])

  // Charger les utilisateurs au démarrage
  useEffect(() => {
    initializeUsers()
  }, [])

  const initializeUsers = () => {
    let storedUsers = localStorage.getItem('cafeUsers')
    
    if (!storedUsers) {
      // Première utilisation, créer les utilisateurs par défaut
      localStorage.setItem('cafeUsers', JSON.stringify(defaultUsers))
      setUsers(defaultUsers)
    } else {
      setUsers(JSON.parse(storedUsers))
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!username || !password) {
      toast.error('Veuillez remplir tous les champs')
      return
    }

    // Rechercher l'utilisateur
    const user = users.find(u => u.username === username && u.password === password)
    
    if (user) {
      onLogin(user)
      toast.success(`Bienvenue ${user.name} !`)
    } else {
      toast.error('Identifiants incorrects')
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>☕ Magaly Café</h1>
          <p>Connexion au système de gestion</p>
        </div>
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label>Nom d'utilisateur</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Entrez votre nom d'utilisateur"
              required
            />
          </div>
          
          <div className="form-group">
            <label>Mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Entrez votre mot de passe"
              required
            />
          </div>

          <button type="submit" className="login-btn">
            Se connecter
          </button>
        </form>

        <div className="login-help">
          <p><strong>Comptes de démonstration :</strong></p>
          <div className="user-accounts">
            <div className="account-item">
              <strong>Hyper Admin:</strong> hyperadmin / hyperadmin123
            </div>
            <div className="account-item">
              <strong>Admin:</strong> admin / admin123
            </div>
            <div className="account-item">
              <strong>Gérant:</strong> gerant / gerant123
            </div>
            <div className="account-item">
              <strong>Serveur:</strong> serveur / serveur123
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login