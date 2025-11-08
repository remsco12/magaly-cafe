import React, { useState, useEffect } from 'react'
import { Plus, Minus, Trash2, AlertTriangle, Save, RefreshCw } from 'lucide-react'
import { toast } from 'react-hot-toast'
import '../styles/StockManagement.css'

const StockManagement = ({ user }) => {
  const [stock, setStock] = useState({})
  const [newIngredient, setNewIngredient] = useState({ 
    name: '', 
    unit: '', 
    alert: '',
    initialQuantity: '' 
  })
  const [editingQuantities, setEditingQuantities] = useState({})

  useEffect(() => {
    const savedStock = localStorage.getItem('cafeStock')
    if (savedStock) {
      const stockData = JSON.parse(savedStock)
      setStock(stockData)
      
      // Initialiser les quantités d'édition
      const initialEditing = {}
      Object.keys(stockData).forEach(key => {
        initialEditing[key] = ''
      })
      setEditingQuantities(initialEditing)
    }
  }, [])

  // FONCTION DE RÉINITIALISATION POUR ADMINISTRATEURS
  const resetApplication = () => {
    if (user.role !== 'hyperadmin') {
      toast.error('❌ Action non autorisée. Administrateur requis.')
      return
    }

    if (window.confirm('⚠️ ATTENTION CRITIQUE !\n\nCette action va :\n• Supprimer TOUTES les ventes\n• Réinitialiser TOUT le stock\n• Supprimer tous les utilisateurs (sauf admin)\n• Effacer toutes les statistiques\n\nÊtes-vous ABSOLUMENT sûr ?')) {
      
      // Sauvegarder l'admin actuel
      const currentAdmin = user
      
      // Supprimer toutes les données
      localStorage.removeItem('salesHistory')
      localStorage.removeItem('cafeProducts')
      localStorage.removeItem('cafePrices')
      
      // Recréer le stock initial
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
      
      // Recréer les utilisateurs (garder l'admin actuel)
      const defaultUsers = [
        { 
          username: currentAdmin.username, 
          password: 'admin123', // Réinitialiser le mot de passe
          role: 'admin', 
          name: 'Administrateur' 
        },
        { 
          username: 'serveur', 
          password: 'serveur123', 
          role: 'serveur', 
          name: 'Serveur' 
        }
      ]
      localStorage.setItem('cafeUsers', JSON.stringify(defaultUsers))
      
      // Remettre l'admin connecté
      localStorage.setItem('cafeUser', JSON.stringify(currentAdmin))
      
      toast.success('✅ Application réinitialisée avec succès!')
      setTimeout(() => {
        window.location.reload()
      }, 2000)
    }
  }

  const updateStock = (ingredient, amount) => {
    const updatedStock = {
      ...stock,
      [ingredient]: {
        ...stock[ingredient],
        quantity: Math.max(0, stock[ingredient].quantity + amount)
      }
    }
    setStock(updatedStock)
    localStorage.setItem('cafeStock', JSON.stringify(updatedStock))
    toast.success(`Stock ${stock[ingredient].name} mis à jour`)
  }

  const updateStockWithCustomAmount = (ingredient) => {
    const amount = parseInt(editingQuantities[ingredient]) || 0
    if (amount === 0) {
      toast.error('Veuillez entrer une quantité valide')
      return
    }

    const updatedStock = {
      ...stock,
      [ingredient]: {
        ...stock[ingredient],
        quantity: Math.max(0, stock[ingredient].quantity + amount)
      }
    }
    setStock(updatedStock)
    localStorage.setItem('cafeStock', JSON.stringify(updatedStock))
    
    // Réinitialiser le champ d'édition
    setEditingQuantities(prev => ({
      ...prev,
      [ingredient]: ''
    }))
    
    toast.success(`${amount}${stock[ingredient].unit} ajouté à ${stock[ingredient].name}`)
  }

  const setExactQuantity = (ingredient) => {
    const newQuantity = parseInt(editingQuantities[ingredient])
    if (isNaN(newQuantity) || newQuantity < 0) {
      toast.error('Veuillez entrer une quantité valide')
      return
    }

    const updatedStock = {
      ...stock,
      [ingredient]: {
        ...stock[ingredient],
        quantity: newQuantity
      }
    }
    setStock(updatedStock)
    localStorage.setItem('cafeStock', JSON.stringify(updatedStock))
    
    // Réinitialiser le champ d'édition
    setEditingQuantities(prev => ({
      ...prev,
      [ingredient]: ''
    }))
    
    toast.success(`Quantité de ${stock[ingredient].name} définie à ${newQuantity}${stock[ingredient].unit}`)
  }

  const addIngredient = () => {
    if (!newIngredient.name || !newIngredient.unit || !newIngredient.alert) {
      toast.error('Veuillez remplir tous les champs obligatoires')
      return
    }

    const key = newIngredient.name.toLowerCase().replace(/ /g, '_')
    const initialQty = parseInt(newIngredient.initialQuantity) || 0

    const updatedStock = {
      ...stock,
      [key]: {
        name: newIngredient.name,
        quantity: initialQty,
        unit: newIngredient.unit,
        alert: parseInt(newIngredient.alert) || 0
      }
    }

    setStock(updatedStock)
    localStorage.setItem('cafeStock', JSON.stringify(updatedStock))
    
    // Ajouter au editingQuantities
    setEditingQuantities(prev => ({
      ...prev,
      [key]: ''
    }))
    
    setNewIngredient({ name: '', unit: '', alert: '', initialQuantity: '' })
    toast.success('Ingrédient ajouté avec succès')
  }

  const removeIngredient = (ingredient) => {
    if (window.confirm(`Supprimer ${stock[ingredient].name} du stock ?`)) {
      const updatedStock = { ...stock }
      delete updatedStock[ingredient]
      setStock(updatedStock)
      localStorage.setItem('cafeStock', JSON.stringify(updatedStock))
      
      // Retirer de editingQuantities
      setEditingQuantities(prev => {
        const newEditing = { ...prev }
        delete newEditing[ingredient]
        return newEditing
      })
      
      toast.success('Ingrédient supprimé')
    }
  }

  const handleQuantityChange = (ingredient, value) => {
    setEditingQuantities(prev => ({
      ...prev,
      [ingredient]: value
    }))
  }

  const isLowStock = (item) => item.quantity <= item.alert

  return (
    <div className="stock-management">
      <div className="stock-header">
        <h2>Gestion des Stocks</h2>
        <p>Surveillez et gérez votre inventaire</p>
      </div>

      {/* SECTION HYPER ADMINISTRATEUR */}
{user && user.role === 'hyperadmin' && (
  <div className="hyperadmin-section">
    <h3 style={{ 
      color: '#ff6b35', 
      borderBottom: '2px solid #ff6b35', 
      paddingBottom: '10px',
      marginTop: '30px',
      marginBottom: '20px'
    }}>
      🚨 Zone Hyper-Administrateur
    </h3>
    
    <div className="hyperadmin-actions">
      <button 
        onClick={resetApplication}
        className="hyperadmin-btn"
        style={{
          background: 'linear-gradient(135deg, #ff6b35 0%, #e55627 100%)',
          color: 'white',
          border: 'none',
          padding: '15px 30px',
          borderRadius: '10px',
          cursor: 'pointer',
          fontSize: '16px',
          fontWeight: 'bold',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          marginTop: '15px',
          transition: 'all 0.3s ease',
          boxShadow: '0 4px 15px rgba(255, 107, 53, 0.3)'
        }}
        onMouseOver={(e) => {
          e.target.style.transform = 'translateY(-2px)'
          e.target.style.boxShadow = '0 6px 20px rgba(255, 107, 53, 0.4)'
        }}
        onMouseOut={(e) => {
          e.target.style.transform = 'translateY(0)'
          e.target.style.boxShadow = '0 4px 15px rgba(255, 107, 53, 0.3)'
        }}
      >
        🚨 Réinitialiser Application Complète
      </button>
      
      <p style={{ 
        fontSize: '13px', 
        color: '#ff6b35', 
        marginTop: '12px',
        fontStyle: 'italic',
        maxWidth: '600px',
        fontWeight: 'bold'
      }}>
        ⚠️ ACTION ULTIME : Seul l'Hyper-Administrateur peut effectuer cette action. 
        Cela supprime TOUTES les données et remet l'application à son état initial.
      </p>
    </div>
  </div>
)}

{/* SECTION ADMINISTRATEUR NORMAL (sans réinitialisation) */}
{user && user.role === 'admin' && (
  <div className="admin-section">
    <h3 style={{ 
      color: '#8B4513', 
      borderBottom: '2px solid #8B4513', 
      paddingBottom: '10px',
      marginTop: '30px',
      marginBottom: '20px'
    }}>
      ⚙️ Zone Administrateur
    </h3>
    
    <div className="admin-actions">
      <p style={{ 
        fontSize: '14px', 
        color: '#666', 
        fontStyle: 'italic'
      }}>
        Vous êtes connecté en tant qu'Administrateur. 
        Seul l'Hyper-Administrateur peut réinitialiser l'application complète.
      </p>
    </div>
  </div>
)}

      {/* Formulaire d'ajout */}
      <div className="add-ingredient-form">
        <h3>Ajouter un Nouvel Ingrédient</h3>
        <div className="form-grid">
          <div className="form-group">
            <label>Nom de l'ingrédient *</label>
            <input
              type="text"
              placeholder="Ex: Sucre, Thé, Chocolat..."
              value={newIngredient.name}
              onChange={(e) => setNewIngredient({...newIngredient, name: e.target.value})}
            />
          </div>
          <div className="form-group">
            <label>Unité *</label>
            <input
              type="text"
              placeholder="Ex: g, ml, sachets..."
              value={newIngredient.unit}
              onChange={(e) => setNewIngredient({...newIngredient, unit: e.target.value})}
            />
          </div>
          <div className="form-group">
            <label>Quantité initiale</label>
            <input
              type="number"
              placeholder="0"
              value={newIngredient.initialQuantity}
              onChange={(e) => setNewIngredient({...newIngredient, initialQuantity: e.target.value})}
            />
          </div>
          <div className="form-group">
            <label>Seuil d'alerte *</label>
            <input
              type="number"
              placeholder="Quantité minimum"
              value={newIngredient.alert}
              onChange={(e) => setNewIngredient({...newIngredient, alert: e.target.value})}
            />
          </div>
          <button onClick={addIngredient} className="add-btn">
            <Plus size={16} />
            Ajouter l'ingrédient
          </button>
        </div>
      </div>

      {/* Tableau des stocks */}
      <div className="stock-table-container">
        <table className="stock-table">
          <thead>
            <tr>
              <th>Ingrédient</th>
              <th>Quantité Actuelle</th>
              <th>Unité</th>
              <th>Seuil d'Alerte</th>
              <th>Statut</th>
              <th>Ajouter/Retirer</th>
              <th>Définir Quantité</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(stock).map(([key, item]) => (
              <tr key={key} className={isLowStock(item) ? 'low-stock' : ''}>
                <td className="ingredient-name">{item.name}</td>
                <td className="quantity-cell">
                  <span className={isLowStock(item) ? 'low-quantity' : ''}>
                    {item.quantity} {item.unit}
                  </span>
                </td>
                <td>{item.unit}</td>
                <td>{item.alert} {item.unit}</td>
                <td>
                  {isLowStock(item) ? (
                    <span className="status-alert">
                      <AlertTriangle size={16} />
                      Alerte Stock
                    </span>
                  ) : (
                    <span className="status-ok">Stock OK</span>
                  )}
                </td>
                <td>
                  <div className="quantity-adjustment">
                    <input
                      type="number"
                      placeholder="Quantité"
                      value={editingQuantities[key] || ''}
                      onChange={(e) => handleQuantityChange(key, e.target.value)}
                      className="quantity-input"
                    />
                    <button 
                      onClick={() => updateStockWithCustomAmount(key)}
                      className="action-btn add"
                      disabled={!editingQuantities[key]}
                    >
                      <Plus size={14} />
                    </button>
                    <button 
                      onClick={() => updateStock(key, -Math.abs(parseInt(editingQuantities[key]) || 0))}
                      className="action-btn remove"
                      disabled={!editingQuantities[key]}
                    >
                      <Minus size={14} />
                    </button>
                  </div>
                </td>
                <td>
                  <div className="set-quantity">
                    <input
                      type="number"
                      placeholder="Nouvelle quantité"
                      value={editingQuantities[key] || ''}
                      onChange={(e) => handleQuantityChange(key, e.target.value)}
                      className="quantity-input"
                    />
                    <button 
                      onClick={() => setExactQuantity(key)}
                      className="action-btn set"
                      disabled={!editingQuantities[key]}
                    >
                      <Save size={14} />
                      Définir
                    </button>
                  </div>
                </td>
                <td>
                  <button 
                    onClick={() => removeIngredient(key)} 
                    className="action-btn delete"
                  >
                    <Trash2 size={14} />
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {Object.keys(stock).length === 0 && (
        <div className="empty-state">
          <p>Aucun ingrédient en stock. Ajoutez-en un pour commencer.</p>
        </div>
      )}
    </div>
  )
}

export default StockManagement