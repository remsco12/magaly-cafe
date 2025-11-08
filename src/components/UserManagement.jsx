import React, { useState, useEffect } from 'react'
import { Users, Plus, Edit3, Trash2, Shield, UserPlus, Save, X } from 'lucide-react'
import { toast } from 'react-hot-toast'
import '../styles/UserManagement.css'

const UserManagement = ({ user }) => {
  const [users, setUsers] = useState([])
  const [editingUser, setEditingUser] = useState(null)
  const [newUser, setNewUser] = useState({
    username: '',
    password: '',
    name: '',
    role: 'serveur'
  })
  const [showAddForm, setShowAddForm] = useState(false)

  // Vérifier les permissions
  const canManageUsers = user?.role === 'hyperadmin' || user?.role === 'admin'

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = () => {
    const savedUsers = localStorage.getItem('cafeUsers')
    if (savedUsers) {
      setUsers(JSON.parse(savedUsers))
    }
  }

  const saveUsers = (updatedUsers) => {
    localStorage.setItem('cafeUsers', JSON.stringify(updatedUsers))
    setUsers(updatedUsers)
  }

  const handleAddUser = () => {
    if (!newUser.username || !newUser.password || !newUser.name) {
      toast.error('Veuillez remplir tous les champs')
      return
    }

    // Vérifier si l'username existe déjà
    if (users.find(u => u.username === newUser.username)) {
      toast.error('Ce nom d\'utilisateur existe déjà')
      return
    }

    const updatedUsers = [...users, newUser]
    saveUsers(updatedUsers)
    
    setNewUser({ username: '', password: '', name: '', role: 'serveur' })
    setShowAddForm(false)
    toast.success('Utilisateur ajouté avec succès')
  }

  const handleEditUser = (userToEdit) => {
    setEditingUser({ ...userToEdit })
  }

  const handleSaveEdit = () => {
    if (!editingUser.username || !editingUser.name) {
      toast.error('Veuillez remplir tous les champs')
      return
    }

    const updatedUsers = users.map(u => 
      u.username === editingUser.username ? editingUser : u
    )
    
    saveUsers(updatedUsers)
    setEditingUser(null)
    toast.success('Utilisateur modifié avec succès')
  }

  const handleDeleteUser = (userToDelete) => {
    // Empêcher la suppression de son propre compte
    if (userToDelete.username === user.username) {
      toast.error('Vous ne pouvez pas supprimer votre propre compte')
      return
    }

    if (window.confirm(`Supprimer l'utilisateur ${userToDelete.name} ?`)) {
      const updatedUsers = users.filter(u => u.username !== userToDelete.username)
      saveUsers(updatedUsers)
      toast.success('Utilisateur supprimé')
    }
  }

  const getRoleBadge = (role) => {
    const roles = {
      'hyperadmin': { label: 'Hyper Admin', color: '#ff6b35', icon: Shield },
      'admin': { label: 'Admin', color: '#8B4513', icon: Users },
      'gerant': { label: 'Gérant', color: '#2E8B57' },
      'serveur': { label: 'Serveur', color: '#4682B4' }
    }
    return roles[role] || { label: role, color: '#666' }
  }

  if (!canManageUsers) {
    return (
      <div className="access-denied">
        <div className="denied-content">
          <Shield size={48} color="#dc3545" />
          <h2>Accès Restreint</h2>
          <p>Seuls les Administrateurs et Hyper-Administrateurs peuvent gérer les utilisateurs.</p>
          <p className="current-role">
            Votre rôle: <strong>{user?.role}</strong>
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="user-management">
      <div className="user-header">
        <h2>
          <Users size={24} />
          Gestion des Utilisateurs
        </h2>
        <p>Créez et gérez les comptes utilisateurs du système</p>
      </div>

      {/* Statistiques */}
      <div className="user-stats">
        <div className="stat-card">
          <span className="stat-number">{users.length}</span>
          <span className="stat-label">Utilisateurs total</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">{users.filter(u => u.role === 'serveur').length}</span>
          <span className="stat-label">Serveurs</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">{users.filter(u => u.role === 'admin' || u.role === 'hyperadmin').length}</span>
          <span className="stat-label">Administrateurs</span>
        </div>
      </div>

      {/* Bouton d'ajout */}
      <div className="add-user-section">
        <button 
          className="add-user-btn"
          onClick={() => setShowAddForm(!showAddForm)}
        >
          <UserPlus size={18} />
          {showAddForm ? 'Annuler' : 'Ajouter un utilisateur'}
        </button>

        {showAddForm && (
          <div className="add-user-form">
            <h4>Nouvel Utilisateur</h4>
            <div className="form-grid">
              <input
                type="text"
                placeholder="Nom complet"
                value={newUser.name}
                onChange={(e) => setNewUser({...newUser, name: e.target.value})}
              />
              <input
                type="text"
                placeholder="Nom d'utilisateur"
                value={newUser.username}
                onChange={(e) => setNewUser({...newUser, username: e.target.value})}
              />
              <input
                type="password"
                placeholder="Mot de passe"
                value={newUser.password}
                onChange={(e) => setNewUser({...newUser, password: e.target.value})}
              />
              <select
                value={newUser.role}
                onChange={(e) => setNewUser({...newUser, role: e.target.value})}
              >
                <option value="serveur">Serveur</option>
                <option value="gerant">Gérant</option>
                {user.role === 'hyperadmin' && <option value="admin">Administrateur</option>}
              </select>
            </div>
            <button className="save-btn" onClick={handleAddUser}>
              <Save size={16} />
              Créer l'utilisateur
            </button>
          </div>
        )}
      </div>

      {/* Liste des utilisateurs */}
      <div className="users-list">
        <h3>Liste des Utilisateurs</h3>
        <div className="users-table">
          <div className="table-header">
            <span>Utilisateur</span>
            <span>Rôle</span>
            <span>Actions</span>
          </div>
          {users.map((userItem, index) => (
            <div key={userItem.username} className="table-row">
              {editingUser && editingUser.username === userItem.username ? (
                // Mode édition
                <>
                  <div className="user-info">
                    <input
                      type="text"
                      value={editingUser.name}
                      onChange={(e) => setEditingUser({...editingUser, name: e.target.value})}
                    />
                    <input
                      type="text"
                      value={editingUser.username}
                      onChange={(e) => setEditingUser({...editingUser, username: e.target.value})}
                    />
                  </div>
                  <div className="user-role">
                    <select
                      value={editingUser.role}
                      onChange={(e) => setEditingUser({...editingUser, role: e.target.value})}
                    >
                      <option value="serveur">Serveur</option>
                      <option value="gerant">Gérant</option>
                      {user.role === 'hyperadmin' && <option value="admin">Admin</option>}
                      {user.role === 'hyperadmin' && <option value="hyperadmin">Hyper Admin</option>}
                    </select>
                  </div>
                  <div className="user-actions">
                    <button className="action-btn save" onClick={handleSaveEdit}>
                      <Save size={14} />
                    </button>
                    <button className="action-btn cancel" onClick={() => setEditingUser(null)}>
                      <X size={14} />
                    </button>
                  </div>
                </>
              ) : (
                // Mode affichage
                <>
                  <div className="user-info">
                    <strong>{userItem.name}</strong>
                    <span>@{userItem.username}</span>
                  </div>
                  <div className="user-role">
                    <span 
                      className="role-badge"
                      style={{ backgroundColor: getRoleBadge(userItem.role).color }}
                    >
                      {getRoleBadge(userItem.role).label}
                    </span>
                  </div>
                  <div className="user-actions">
                    <button 
                      className="action-btn edit"
                      onClick={() => handleEditUser(userItem)}
                      disabled={userItem.username === user.username}
                    >
                      <Edit3 size={14} />
                    </button>
                    <button 
                      className="action-btn delete"
                      onClick={() => handleDeleteUser(userItem)}
                      disabled={userItem.username === user.username}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default UserManagement