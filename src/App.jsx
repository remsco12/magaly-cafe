import React, { useState, useEffect } from 'react'
import { Toaster, toast } from 'react-hot-toast'
import { Coffee, Package, BarChart3, Bell, DollarSign, Users, Crown } from 'lucide-react'
import Dashboard from './components/Dashboard'
import SalesTerminal from './components/SalesTerminal'
import StockManagement from './components/StockManagement'
import Notifications from './components/Notifications'
import PriceManagement from './components/PriceManagement'
import Statistics from './components/Statistics'
import UserManagement from './components/UserManagement'
import Login from './components/Login'
import Header from './components/Header'
import { useStockAlert } from './hooks/useStockAlert'
import { defaultUsers } from './data/defaultUsers'
import './App.css'

function App() {
  const [user, setUser] = useState(null)
  const [activeTab, setActiveTab] = useState('dashboard')
  const [notifications, setNotifications] = useState([])
  const { checkStockAlerts } = useStockAlert()

  // Initialiser les données au premier chargement
  useEffect(() => {
    initializeApplicationData()
    checkExistingUser()
  }, [])

  const initializeApplicationData = () => {
    // Initialiser les utilisateurs si inexistants
    if (!localStorage.getItem('cafeUsers')) {
      localStorage.setItem('cafeUsers', JSON.stringify(defaultUsers))
    }

    // Initialiser le stock si inexistant
    if (!localStorage.getItem('cafeStock')) {
      const initialStock = {
        cafe: { name: "Café moulu", quantity: 1000, unit: "g", alert: 100 },
        lait: { name: "Lait", quantity: 20000, unit: "ml", alert: 2000 },
        eau: { name: "Eau", quantity: 50000, unit: "ml", alert: 5000 },
        chocolat: { name: "Chocolat", quantity: 500, unit: "g", alert: 50 },
        caramel: { name: "Caramel", quantity: 500, unit: "ml", alert: 50 },
        whisky: { name: "Whisky", quantity: 1000, unit: "ml", alert: 100 },
        sucre: { name: "Sucre", quantity: 2000, unit: "g", alert: 200 },
        creme: { name: "Crème", quantity: 5000, unit: "ml", alert: 500 },
        the_vert: { name: "Thé Vert", quantity: 200, unit: "g", alert: 20 },
        the_noir: { name: "Thé Noir", quantity: 200, unit: "g", alert: 20 },
        infusion: { name: "Infusion", quantity: 200, unit: "g", alert: 20 }
      }
      localStorage.setItem('cafeStock', JSON.stringify(initialStock))
    }
  }

  const checkExistingUser = () => {
    const savedUser = localStorage.getItem('cafeUser')
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser))
      } catch (e) {
        console.error('Erreur parsing user:', e)
        localStorage.removeItem('cafeUser')
      }
    }
  }

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
  }, [user, checkStockAlerts])

  const handleLogin = (userData) => {
    setUser(userData)
    localStorage.setItem('cafeUser', JSON.stringify(userData))
    
    // Message de bienvenue personnalisé selon le rôle
    const welcomeMessages = {
      'hyperadmin': `🚨 Bienvenue ${userData.name} - Mode Hyper Administrateur activé !`,
      'admin': `⚙️ Bienvenue ${userData.name} - Mode Administrateur activé !`,
      'gerant': `👔 Bienvenue ${userData.name} - Mode Gérant activé !`,
      'serveur': `☕ Bienvenue ${userData.name} - Mode Serveur activé !`
    }
    
    toast.success(welcomeMessages[userData.role] || `Bienvenue ${userData.name} !`)
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
    { 
      id: 'dashboard', 
      name: 'Tableau de Bord', 
      icon: BarChart3, 
      roles: ['hyperadmin', 'admin', 'gerant', 'serveur'] 
    },
    { 
      id: 'sales', 
      name: 'Ventes', 
      icon: Coffee, 
      roles: ['hyperadmin', 'admin', 'gerant', 'serveur'] 
    },
    { 
      id: 'stock', 
      name: 'Stock', 
      icon: Package, 
      roles: ['hyperadmin', 'admin', 'gerant']  // gerant peut gérer le stock
    },
    { 
      id: 'prices', 
      name: 'Prix', 
      icon: DollarSign, 
      roles: ['hyperadmin', 'admin']  // Seulement hyperadmin et admin
    },
    { 
      id: 'statistics', 
      name: 'Statistiques', 
      icon: BarChart3, 
      roles: ['hyperadmin', 'admin']  // Seulement hyperadmin et admin
    },
    { 
      id: 'users', 
      name: 'Utilisateurs', 
      icon: Users, 
      roles: ['hyperadmin']  // SEUL l'hyper-admin peut gérer les utilisateurs
    },
    { 
      id: 'notifications', 
      name: 'Notifications', 
      icon: Bell, 
      roles: ['hyperadmin', 'admin', 'gerant']  // gerant peut voir les notifications
    }
  ]

  return allTabs.filter(tab => tab.roles.includes(user?.role))
}

  // Obtenir le badge de rôle stylisé
  const getRoleBadge = (role) => {
    const badges = {
      'hyperadmin': { label: 'Hyper Admin', color: '#ff6b35', icon: Crown },
      'admin': { label: 'Administrateur', color: '#8B4513' },
      'gerant': { label: 'Gérant', color: '#2E8B57' },
      'serveur': { label: 'Serveur', color: '#4682B4' }
    }
    
    return badges[role] || { label: role, color: '#666' }
  }

  if (!user) {
    return <Login onLogin={handleLogin} />
  }

  const tabs = getTabs()
  const roleBadge = getRoleBadge(user.role)

  return (
    <div className="app">
      <Toaster 
        position="top-right" 
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            style: {
              background: '#10B981',
            },
          },
          error: {
            style: {
              background: '#EF4444',
            },
          },
        }}
      />
      
      {/* Header commun pour toute l'app */}
      <Header user={user} onLogout={handleLogout} roleBadge={roleBadge} />

      // Dans la partie return de App.jsx, remplacez la navigation par :
<nav className="app-nav">
  <div className="nav-content">
    <div className="user-role-indicator">
      <span 
        className="role-badge"
        style={{ backgroundColor: roleBadge.color }}
      >
        {roleBadge.icon && <roleBadge.icon size={14} />}
        {roleBadge.label}
      </span>
    </div>
    
    <div className="nav-buttons">
      {tabs.map(tab => (
        <button
          key={tab.id}
          className={`nav-btn ${activeTab === tab.id ? 'active' : ''}`}
          onClick={() => setActiveTab(tab.id)}
          title={tab.name}
        >
          <tab.icon size={18} />
          <span className="nav-btn-text">{tab.name}</span>
        </button>
      ))}
    </div>
  </div>
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

      {/* Footer avec informations */}
      <footer className="app-footer">
        <div className="footer-content">
          <span className="app-version">Magaly Café v1.0.0</span>
          <span className="user-info">
            Connecté en tant que <strong>{user.name}</strong> 
            <span 
              className="role-tag"
              style={{ backgroundColor: roleBadge.color }}
            >
              {roleBadge.label}
            </span>
          </span>
        </div>
      </footer>
    </div>
  )
}

export default App