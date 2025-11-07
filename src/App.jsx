import React, { useState, useEffect } from 'react'
import { Toaster, toast } from 'react-hot-toast'
import { Coffee, BarChart3, LogOut } from 'lucide-react'
import SalesTerminal from './components/SalesTerminal'
import Login from './components/Login'
import './App.css'

function App() {
  const [user, setUser] = useState(null)
  const [activeTab, setActiveTab] = useState('sales')

  // Vérifier si un utilisateur est déjà connecté au chargement
  useEffect(() => {
    const savedUser = localStorage.getItem('cafeUser')
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser))
      } catch (e) {
        console.error('Erreur parsing user:', e)
        localStorage.removeItem('cafeUser')
      }
    }
  }, [])

  const handleLogin = (userData) => {
    setUser(userData)
    localStorage.setItem('cafeUser', JSON.stringify(userData))
    toast.success(`Bienvenue ${userData.username}!`)
  }

  const handleLogout = () => {
    setUser(null)
    setActiveTab('sales')
    localStorage.removeItem('cafeUser')
    toast.success('Déconnexion réussie')
  }

  if (!user) {
    return <Login onLogin={handleLogin} />
  }

  return (
    <div className="app">
      <Toaster position="top-right" />
      
      {/* Header simplifié */}
      <header className="app-header">
        <div className="header-content">
          <div className="logo">
            <div className="logo-fallback">
              <span className="logo-icon">☕</span>
            </div>
            <div className="logo-text">
              <h1>Magaly Café</h1>
              <span className="logo-subtitle">Terminal de Vente</span>
            </div>
          </div>
          <div className="header-actions">
            <span className="welcome">
              Bienvenue, {user.username}
            </span>
            <button onClick={handleLogout} className="logout-btn">
              <LogOut size={16} />
              Déconnexion
            </button>
          </div>
        </div>
      </header>

      {/* Navigation simplifiée */}
      <nav className="app-nav">
        <button
          className={`nav-btn ${activeTab === 'sales' ? 'active' : ''}`}
          onClick={() => setActiveTab('sales')}
        >
          <Coffee size={20} />
          <span>Terminal de Vente</span>
        </button>
      </nav>

      {/* Main Content */}
      <main className="app-main">
        {activeTab === 'sales' && <SalesTerminal user={user} />}
      </main>
    </div>
  )
}

export default App