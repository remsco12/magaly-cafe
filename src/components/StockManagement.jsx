import React, { useState, useEffect } from 'react'
import { Plus, Minus, Trash2, AlertTriangle, Save } from 'lucide-react'
import { toast } from 'react-hot-toast'
import '../styles/StockManagement.css'

const StockManagement = () => {
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