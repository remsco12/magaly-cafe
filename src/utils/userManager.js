// Gestionnaire des utilisateurs
export const userManager = {
  // Initialiser les utilisateurs par défaut
  initializeUsers: () => {
    const defaultUsers = [
      { 
        username: 'hyperadmin', 
        password: 'hyperadmin123', 
        role: 'hyperadmin', 
        name: 'Hyper Administrateur' 
      },
      { 
        username: 'admin', 
        password: 'admin123', 
        role: 'admin', 
        name: 'Administrateur' 
      },
      { 
        username: 'gerant', 
        password: 'gerant123', 
        role: 'gerant', 
        name: 'Gérant' 
      },
      { 
        username: 'serveur', 
        password: 'serveur123', 
        role: 'serveur', 
        name: 'Serveur' 
      }
    ]

    if (!localStorage.getItem('cafeUsers')) {
      localStorage.setItem('cafeUsers', JSON.stringify(defaultUsers))
    }
    return defaultUsers
  },

  // Récupérer tous les utilisateurs
  getUsers: () => {
    const users = localStorage.getItem('cafeUsers')
    return users ? JSON.parse(users) : userManager.initializeUsers()
  },

  // Vérifier les identifiants
  authenticate: (username, password) => {
    const users = userManager.getUsers()
    const user = users.find(u => u.username === username && u.password === password)
    return user || null
  },

  // Sauvegarder l'utilisateur connecté
  setCurrentUser: (user) => {
    localStorage.setItem('cafeUser', JSON.stringify(user))
  },

  // Récupérer l'utilisateur connecté
  getCurrentUser: () => {
    const user = localStorage.getItem('cafeUser')
    return user ? JSON.parse(user) : null
  },

  // Déconnexion
  logout: () => {
    localStorage.removeItem('cafeUser')
  }
}