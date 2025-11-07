import React, { useState, useEffect } from 'react'
import { Toaster, toast } from 'react-hot-toast'
import { Coffee, Package, BarChart3, Bell, LogOut, DollarSign } from 'lucide-react'
import Dashboard from './components/Dashboard'
import SalesTerminal from './components/SalesTerminal'
import StockManagement from './components/StockManagement'
import Notifications from './components/Notifications'
import PriceManagement from './components/PriceManagement'
import Statistics from './components/Statistics'
import UserManagement from './components/UserManagement'
import { Users } from 'lucide-react'
import Login from './components/Login'
import { useStockAlert } from './hooks/useStockAlert'
import { useLogo } from './hooks/useLogo'
import './App.css'

function App() {
  const [user, setUser] = useState(null)
  const [activeTab, setActiveTab] = useState('dashboard')
  const [notifications, setNotifications] = useState([])
  const { checkStockAlerts } = useStockAlert()
  const logo = useLogo()

  // Vérifier si un utilisateur est déjà connecté au chargement
  useEffect(() => {
    const savedUser = localStorage.getItem('cafeUser')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
  }, [])

  // Vérifier les alertes de stock
  useEffect(() => {
    if (user) {
      const alerts = checkStockAlerts()
      if (alerts.length > 0) {
        alerts.forEach(alert => {
          toast.error(alert.message, { duration: 6000 })
          setNotifications(prev => [...prev, {
            id: Date.now(),
            type: 'warning',
            message: alert.message,
            timestamp: new Date(),
            read: false
          }])
        })
      }
    }
  }, [user])

  const handleLogin = (userData) => {
    setUser(userData)
    localStorage.setItem('cafeUser', JSON.stringify(userData))
    toast.success(`Bienvenue ${userData.username}!`)
  }

  const handleLogout = () => {
    setUser(null)
    setActiveTab('dashboard')
    localStorage.removeItem('cafeUser')
    toast.success('Déconnexion réussie')
  }

  // Définir les onglets accessibles par rôle
  const getTabs = () => {
    const allTabs = [
      { id: 'dashboard', name: 'Tableau de Bord', icon: BarChart3, roles: ['admin', 'gerant', 'serveur'] },
      { id: 'sales', name: 'Ventes', icon: Coffee, roles: ['admin', 'gerant', 'serveur'] },
      { id: 'stock', name: 'Stock', icon: Package, roles: ['admin', 'gerant'] },
      { id: 'prices', name: 'Prix', icon: DollarSign, roles: ['admin'] },
      { id: 'statistics', name: 'Statistiques', icon: BarChart3, roles: ['admin'] },
      { id: 'users', name: 'Utilisateurs', icon: Users, roles: ['admin'] },
      { id: 'notifications', name: 'Notifications', icon: Bell, roles: ['admin', 'gerant'] }
    ]

    return allTabs.filter(tab => tab.roles.includes(user?.role))
  }

  if (!user) {
    return <Login onLogin={handleLogin} />
  }

  const tabs = getTabs()

  return (
    <div className="app">
      <Toaster position="top-right" />
      
      {/* Header avec logo */}
      <header className="app-header">
        <div className="header-content">
          <div className="logo">
  <img 
    src="${window.location.origin}/logo.png" 
    alt="Magaly Café" 
    className="logo-image"
    onError={(e) => {
      // Fallback si le logo ne charge pas
      e.target.style.display = 'none'
      // Afficher un fallback
      const fallback = document.createElement('div')
      fallback.className = 'logo-fallback'
      fallback.innerHTML = '☕'
      fallback.style.cssText = `
        width: 50px;
        height: 50px;
        background: #8B4513;
        border-radius: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 15px;
        font-size: 24px;
        color: white;
      `
      e.target.parentNode.insertBefore(fallback, e.target)
    }}
  />
  <div className="logo-text">
    <h1>Magaly Café</h1>
    <span className="logo-subtitle">Gestion Professionnelle</span>
  </div>
</div>
          <div className="header-actions">
            <span className="welcome">
              Bienvenue, {user.username} ({user.role})
            </span>
            <button onClick={handleLogout} className="logout-btn">
              <LogOut size={16} />
              Déconnexion
            </button>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="app-nav">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`nav-btn ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <tab.icon size={20} />
            <span>{tab.name}</span>
          </button>
        ))}
      </nav>

      {/* Main Content */}
      <main className="app-main">
        {activeTab === 'dashboard' && <Dashboard user={user} />}
        {activeTab === 'sales' && <SalesTerminal user={user} />}
        {activeTab === 'stock' && <StockManagement user={user} />}
        {activeTab === 'prices' && <PriceManagement user={user} />}
        {activeTab === 'statistics' && <Statistics user={user} />}
        {activeTab === 'users' && <UserManagement user={user} />}
        {activeTab === 'notifications' && (
          <Notifications 
            notifications={notifications} 
            setNotifications={setNotifications} 
            user={user}
          />
        )}
      </main>
    </div>
  )
}

export default App

