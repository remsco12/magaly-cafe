import React, { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, User, Shield, Coffee, Save, X, Key } from 'lucide-react'
import { toast } from 'react-hot-toast'
import '../styles/UserManagement.css'

const UserManagement = () => {
  const [users, setUsers] = useState([])
  const [editingUser, setEditingUser] = useState(null)
  const [newUser, setNewUser] = useState({
    username: '',
    password: '',
    role: 'serveur',
    name: ''
  })
  const [showPassword, setShowPassword] = useState(false)

  // Utilisateurs par défaut
  const defaultUsers = {
    'admin': { password: 'admin123', role: 'admin', name: 'Administrateur' },
    'gerant': { password: 'gerant123', role: 'gerant', name: 'Gérant' },
    'serveur': { password: 'serveur123', role: 'serveur', name: 'Serveur' }
  }

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = () => {
    const savedUsers = JSON.parse(localStorage.getItem('cafeUsers')) || defaultUsers
    setUsers(savedUsers)
  }

  const saveUsers = (usersData) => {
    localStorage.setItem('cafeUsers', JSON.stringify(usersData))
    setUsers(usersData)
  }

  const handleCreateUser = () => {
    if (!newUser.username || !newUser.password || !newUser.name) {
      toast.error('Tous les champs sont obligatoires')
      return
    }

    if (users[newUser.username]) {
      toast.error('Ce nom d\'utilisateur existe déjà')
      return
    }

    if (newUser.password.length < 4) {
      toast.error('Le mot de passe doit contenir au moins 4 caractères')
      return
    }

    const updatedUsers = {
      ...users,
      [newUser.username]: {
        password: newUser.password,
        role: newUser.role,
        name: newUser.name
      }
    }

    saveUsers(updatedUsers)
    setNewUser({ username: '', password: '', role: 'serveur', name: '' })
    toast.success('Utilisateur créé avec succès')
  }

  const handleUpdateUser = (username, updatedData) => {
    const updatedUsers = {
      ...users,
      [username]: {
        ...users[username],
        ...updatedData
      }
    }

    saveUsers(updatedUsers)
    setEditingUser(null)
    toast.success('Utilisateur mis à jour avec succès')
  }

  const handleDeleteUser = (username) => {
    if (username === 'admin') {
      toast.error('Impossible de supprimer le compte administrateur')
      return
    }

    if (Object.keys(users).length <= 1) {
      toast.error('Impossible de supprimer le dernier utilisateur')
      return
    }

    if (window.confirm(`Supprimer l'utilisateur "${username}" ?`)) {
      const updatedUsers = { ...users }
      delete updatedUsers[username]
      saveUsers(updatedUsers)
      toast.success('Utilisateur supprimé avec succès')
    }
  }

  const resetPassword = (username) => {
    const newPassword = generateRandomPassword()
    const updatedUsers = {
      ...users,
      [username]: {
        ...users[username],
        password: newPassword
      }
    }

    saveUsers(updatedUsers)
    toast.success(`Mot de passe réinitialisé: ${newPassword}`, { duration: 5000 })
  }

  const generateRandomPassword = () => {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
    let password = ''
    for (let i = 0; i < 6; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return password
  }

  const getRoleIcon = (role) => {
    switch (role) {
      case 'admin': return <Shield size={16} />
      case 'gerant': return <User size={16} />
      case 'serveur': return <Coffee size={16} />
      default: return <User size={16} />
    }
  }

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return '#EF4444'
      case 'gerant': return '#F59E0B'
      case 'serveur': return '#10B981'
      default: return '#6B7280'
    }
  }

  const getRoleName = (role) => {
    switch (role) {
      case 'admin': return 'Administrateur'
      case 'gerant': return 'Gérant'
      case 'serveur': return 'Serveur'
      default: return role
    }
  }

  return (
    <div className="user-management">
      <div className="user-header">
        <h2>👥 Gestion des Utilisateurs</h2>
        <p>Créez et gérez les accès à l'application</p>
      </div>

      {/* Formulaire de création */}
      <div className="create-user-form">
        <h3>➕ Créer un Nouvel Utilisateur</h3>
        <div className="form-grid">
          <div className="form-group">
            <label>Nom complet *</label>
            <input
              type="text"
              placeholder="Ex: Jean Dupont"
              value={newUser.name}
              onChange={(e) => setNewUser({...newUser, name: e.target.value})}
            />
          </div>
          <div className="form-group">
            <label>Nom d'utilisateur *</label>
            <input
              type="text"
              placeholder="Ex: jean.dupont"
              value={newUser.username}
              onChange={(e) => setNewUser({...newUser, username: e.target.value})}
            />
          </div>
          <div className="form-group">
            <label>Mot de passe *</label>
            <div className="password-input">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Minimum 4 caractères"
                value={newUser.password}
                onChange={(e) => setNewUser({...newUser, password: e.target.value})}
              />
              <button
                type="button"
                className="show-password-btn"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </div>
          <div className="form-group">
            <label>Rôle *</label>
            <select
              value={newUser.role}
              onChange={(e) => setNewUser({...newUser, role: e.target.value})}
            >
              <option value="serveur">Serveur</option>
              <option value="gerant">Gérant</option>
              <option value="admin">Administrateur</option>
            </select>
          </div>
          <button onClick={handleCreateUser} className="create-btn">
            <Plus size={16} />
            Créer l'utilisateur
          </button>
        </div>
      </div>

      {/* Liste des utilisateurs */}
      <div className="users-list">
        <h3>📋 Utilisateurs Existants ({Object.keys(users).length})</h3>
        <div className="users-grid">
          {Object.entries(users).map(([username, userData]) => (
            <div key={username} className="user-card">
              <div className="user-header">
                <div className="user-avatar">
                  {getRoleIcon(userData.role)}
                </div>
                <div className="user-info">
                  <h4 className="user-name">{userData.name}</h4>
                  <p className="user-username">@{username}</p>
                  <span 
                    className="user-role"
                    style={{ backgroundColor: getRoleColor(userData.role) }}
                  >
                    {getRoleName(userData.role)}
                  </span>
                </div>
              </div>

              {editingUser === username ? (
                <div className="user-edit-form">
                  <input
                    type="text"
                    placeholder="Nouveau nom complet"
                    defaultValue={userData.name}
                    onBlur={(e) => handleUpdateUser(username, { name: e.target.value })}
                    className="edit-input"
                  />
                  <select
                    defaultValue={userData.role}
                    onChange={(e) => handleUpdateUser(username, { role: e.target.value })}
                    className="edit-select"
                  >
                    <option value="serveur">Serveur</option>
                    <option value="gerant">Gérant</option>
                    <option value="admin">Administrateur</option>
                  </select>
                  <div className="edit-actions">
                    <button onClick={() => setEditingUser(null)} className="cancel-btn">
                      <X size={14} />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="user-actions">
                  <button 
                    onClick={() => setEditingUser(username)}
                    className="edit-btn"
                    title="Modifier l'utilisateur"
                  >
                    <Edit size={14} />
                  </button>
                  <button 
                    onClick={() => resetPassword(username)}
                    className="password-btn"
                    title="Réinitialiser le mot de passe"
                  >
                    <Key size={14} />
                  </button>
                  {username !== 'admin' && (
                    <button 
                      onClick={() => handleDeleteUser(username)}
                      className="delete-btn"
                      title="Supprimer l'utilisateur"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Informations sur les rôles */}
      <div className="roles-info">
        <h3>🔐 Niveaux d'Accès</h3>
        <div className="roles-grid">
          <div className="role-card">
            <div className="role-icon" style={{ backgroundColor: '#EF4444' }}>
              <Shield size={20} />
            </div>
            <div className="role-content">
              <h4>Administrateur</h4>
              <p>Accès complet à toutes les fonctionnalités</p>
              <ul>
                <li>Gestion des utilisateurs</li>
                <li>Statistiques avancées</li>
                <li>Gestion des prix</li>
                <li>Gestion du stock</li>
                <li>Ventes</li>
              </ul>
            </div>
          </div>
          <div className="role-card">
            <div className="role-icon" style={{ backgroundColor: '#F59E0B' }}>
              <User size={20} />
            </div>
            <div className="role-content">
              <h4>Gérant</h4>
              <p>Accès à la gestion quotidienne</p>
              <ul>
                <li>Gestion du stock</li>
                <li>Ventes</li>
                <li>Tableau de bord</li>
                <li>Notifications</li>
              </ul>
            </div>
          </div>
          <div className="role-card">
            <div className="role-icon" style={{ backgroundColor: '#10B981' }}>
              <Coffee size={20} />
            </div>
            <div className="role-content">
              <h4>Serveur</h4>
              <p>Accès limité aux ventes</p>
              <ul>
                <li>Terminal de vente</li>
                <li>Tableau de bord</li>
                <li>Consultation basique</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {Object.keys(users).length === 0 && (
        <div className="empty-users">
          <div className="empty-icon">👥</div>
          <h3>Aucun utilisateur</h3>
          <p>Créez votre premier utilisateur pour commencer</p>
        </div>
      )}
    </div>
  )
}

export default UserManagement