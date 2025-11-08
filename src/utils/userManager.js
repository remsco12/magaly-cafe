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

    const storedUsers = localStorage.getItem('cafeUsers')
    if (!storedUsers) {
      localStorage.setItem('cafeUsers', JSON.stringify(defaultUsers))
      console.log('✅ Utilisateurs par défaut créés:', defaultUsers)
    } else {
      console.log('📁 Utilisateurs existants:', JSON.parse(storedUsers))
    }
    
    return storedUsers ? JSON.parse(storedUsers) : defaultUsers
  },

  // Récupérer tous les utilisateurs
  getUsers: () => {
    const users = localStorage.getItem('cafeUsers')
    if (!users) {
      return userManager.initializeUsers()
    }
    return JSON.parse(users)
  },

  // Vérifier les identifiants
  authenticate: (username, password) => {
    const users = userManager.getUsers()
    console.log('🔍 Recherche utilisateur:', username)
    console.log('📋 Utilisateurs disponibles:', users)
    
    const user = users.find(u => 
      u.username === username && u.password === password
    )
    
    console.log('✅ Utilisateur trouvé:', user)
    return user || null
  },

  // Sauvegarder l'utilisateur connecté
  setCurrentUser: (user) => {
    localStorage.setItem('cafeUser', JSON.stringify(user))
    console.log('💾 Utilisateur connecté sauvegardé:', user)
  },

  // Récupérer l'utilisateur connecté
  getCurrentUser: () => {
    const user = localStorage.getItem('cafeUser')
    return user ? JSON.parse(user) : null
  },

  // Déconnexion
  logout: () => {
    localStorage.removeItem('cafeUser')
    console.log('🚪 Utilisateur déconnecté')
  }
}