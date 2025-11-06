import React, { useState, useEffect } from 'react'
import { Edit, Save, X, Plus, Trash2, ChevronDown, ChevronUp, Search } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { productManager } from '../utils/productManager'
import '../styles/PriceManagement.css'

const PriceManagement = () => {
  const [productsByCategory, setProductsByCategory] = useState({})
  const [editingProduct, setEditingProduct] = useState(null)
  const [newPrice, setNewPrice] = useState('')
  const [newCustomProduct, setNewCustomProduct] = useState({
    name: '',
    price: '',
    category: 'custom',
    ingredients: {}
  })
  const [expandedCategories, setExpandedCategories] = useState({})
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    loadProducts()
    // Ouvrir toutes les catégories par défaut
    const categories = Object.keys(productManager.categories)
    const initialExpanded = {}
    categories.forEach(cat => {
      initialExpanded[cat] = true
    })
    setExpandedCategories(initialExpanded)
  }, [])

  const loadProducts = () => {
    const groupedProducts = productManager.getProductsByCategory()
    setProductsByCategory(groupedProducts)
  }

  const toggleCategory = (category) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }))
  }

  const startEditing = (product) => {
    setEditingProduct(product.id)
    setNewPrice(product.price)
  }

  const savePrice = (productId) => {
    const price = parseFloat(newPrice)
    if (isNaN(price) || price < 0) {
      toast.error('Prix invalide')
      return
    }

    productManager.updatePrice(productId, price)
    setEditingProduct(null)
    setNewPrice('')
    loadProducts()
    toast.success('Prix mis à jour avec succès')
  }

  const cancelEditing = () => {
    setEditingProduct(null)
    setNewPrice('')
  }

  const addCustomProduct = () => {
    if (!newCustomProduct.name || !newCustomProduct.price) {
      toast.error('Nom et prix sont obligatoires')
      return
    }

    const price = parseFloat(newCustomProduct.price)
    if (isNaN(price) || price < 0) {
      toast.error('Prix invalide')
      return
    }

    // Récupérer le stock pour la sélection des ingrédients
    const stock = JSON.parse(localStorage.getItem('cafeStock')) || {}

    // Créer l'objet ingrédients
    const ingredients = {}
    Object.keys(stock).forEach(ingredientKey => {
      const quantity = parseFloat(newCustomProduct.ingredients[ingredientKey]) || 0
      if (quantity > 0) {
        ingredients[ingredientKey] = quantity
      }
    })

    if (Object.keys(ingredients).length === 0) {
      toast.error('Ajoutez au moins un ingrédient')
      return
    }

    const product = {
      name: newCustomProduct.name,
      price: price,
      category: newCustomProduct.category,
      ingredients: ingredients
    }

    productManager.addCustomProduct(product)
    
    setNewCustomProduct({
      name: '',
      price: '',
      category: 'custom',
      ingredients: {}
    })
    
    loadProducts()
    toast.success('Produit personnalisé ajouté avec succès')
  }

  const removeCustomProduct = (productId) => {
    if (window.confirm('Supprimer ce produit personnalisé ?')) {
      productManager.removeCustomProduct(productId)
      loadProducts()
      toast.success('Produit supprimé')
    }
  }

  const updateCustomProductIngredient = (ingredientKey, quantity) => {
    setNewCustomProduct(prev => ({
      ...prev,
      ingredients: {
        ...prev.ingredients,
        [ingredientKey]: quantity
      }
    }))
  }

  const stock = JSON.parse(localStorage.getItem('cafeStock')) || {}

  // Filtrer les produits par recherche
  const filterProducts = (products) => {
    if (!searchTerm) return products
    return products.filter(product => 
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }

  const getTotalProducts = () => {
    return Object.values(productsByCategory).reduce((total, products) => total + products.length, 0)
  }

  return (
    <div className="price-management">
      <div className="price-header">
        <h2>Gestion des Prix et Produits</h2>
        <p>Configurez les prix et gérez votre carte ({getTotalProducts()} produits)</p>
      </div>

      {/* Barre de recherche */}
      <div className="search-section">
        <div className="search-bar">
          <Search size={20} />
          <input
            type="text"
            placeholder="Rechercher un produit..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      {/* Ajout de produit personnalisé */}
      <div className="add-product-form">
        <h3>➕ Ajouter un Produit Personnalisé</h3>
        <div className="form-grid">
          <div className="form-group">
            <label>Nom du produit *</label>
            <input
              type="text"
              placeholder="Ex: Café Spécial, Thé Maison..."
              value={newCustomProduct.name}
              onChange={(e) => setNewCustomProduct({...newCustomProduct, name: e.target.value})}
            />
          </div>
          <div className="form-group">
            <label>Prix (FCFA) *</label>
            <input
              type="number"
              placeholder="Prix en FCFA"
              value={newCustomProduct.price}
              onChange={(e) => setNewCustomProduct({...newCustomProduct, price: e.target.value})}
            />
          </div>
          <div className="form-group">
            <label>Catégorie</label>
            <select
              value={newCustomProduct.category}
              onChange={(e) => setNewCustomProduct({...newCustomProduct, category: e.target.value})}
              className="category-select"
            >
              {Object.entries(productManager.categories).map(([key, category]) => (
                <option key={key} value={key}>
                  {category.icon} {category.name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group full-width">
            <label>Ingrédients *</label>
            <div className="ingredients-grid">
              {Object.entries(stock).map(([key, item]) => (
                <div key={key} className="ingredient-input">
                  <span className="ingredient-name">
                    {item.name} ({item.unit})
                  </span>
                  <input
                    type="number"
                    placeholder="0"
                    value={newCustomProduct.ingredients[key] || ''}
                    onChange={(e) => updateCustomProductIngredient(key, e.target.value)}
                    min="0"
                    step="0.1"
                  />
                </div>
              ))}
            </div>
          </div>
          <button onClick={addCustomProduct} className="add-product-btn">
            <Plus size={16} />
            Ajouter le Produit
          </button>
        </div>
      </div>

      {/* Liste des produits par catégorie */}
      <div className="categories-section">
        {Object.entries(productsByCategory).map(([categoryKey, products]) => {
          if (products.length === 0) return null
          
          const categoryInfo = productManager.getCategoryInfo(categoryKey)
          const filteredProducts = filterProducts(products)
          if (filteredProducts.length === 0) return null

          return (
            <div key={categoryKey} className="category-section">
              <div 
                className="category-header"
                onClick={() => toggleCategory(categoryKey)}
                style={{ borderLeftColor: categoryInfo.color }}
              >
                <div className="category-title">
                  <span className="category-icon">{categoryInfo.icon}</span>
                  <h3>{categoryInfo.name}</h3>
                  <span className="product-count">({filteredProducts.length} produit(s))</span>
                </div>
                <div className="category-actions">
                  {expandedCategories[categoryKey] ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </div>
              </div>

              {expandedCategories[categoryKey] && (
                <div className="products-grid">
                  {filteredProducts.map(product => (
                    <div key={product.id} className="product-card">
                      <div className="product-info">
                        <div className="product-name">
                          {product.name}
                          {product.isCustom && <span className="custom-badge">Personnalisé</span>}
                        </div>
                        <div className="product-ingredients">
                          {Object.entries(product.ingredients).map(([key, quantity]) => (
                            <span key={key} className="ingredient-tag">
                              {quantity}{stock[key]?.unit} {stock[key]?.name}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div className="product-price-section">
                        {editingProduct === product.id ? (
                          <div className="price-edit">
                            <input
                              type="number"
                              value={newPrice}
                              onChange={(e) => setNewPrice(e.target.value)}
                              className="price-input"
                              placeholder="Prix en FCFA"
                            />
                            <div className="edit-actions">
                              <button onClick={() => savePrice(product.id)} className="save-btn" title="Enregistrer">
                                <Save size={14} />
                              </button>
                              <button onClick={cancelEditing} className="cancel-btn" title="Annuler">
                                <X size={14} />
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="price-display">
                            <span className="price-value">{product.price.toFixed(0)} FCFA</span>
                            <button 
                              onClick={() => startEditing(product)}
                              className="edit-btn"
                              title="Modifier le prix"
                            >
                              <Edit size={14} />
                            </button>
                          </div>
                        )}
                      </div>

                      <div className="product-actions">
                        {product.isCustom && (
                          <button 
                            onClick={() => removeCustomProduct(product.id)}
                            className="delete-btn"
                            title="Supprimer le produit"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Message si aucun produit trouvé */}
      {getTotalProducts() === 0 && (
        <div className="empty-state">
          <div className="empty-icon">📝</div>
          <h3>Aucun produit configuré</h3>
          <p>Commencez par ajouter vos premiers produits personnalisés</p>
        </div>
      )}

      {getTotalProducts() > 0 && Object.values(productsByCategory).every(products => filterProducts(products).length === 0) && (
        <div className="empty-state">
          <div className="empty-icon">🔍</div>
          <h3>Aucun produit trouvé</h3>
          <p>Aucun produit ne correspond à votre recherche "{searchTerm}"</p>
        </div>
      )}
    </div>
  )
}

export default PriceManagement