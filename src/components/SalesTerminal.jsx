import React, { useState, useEffect } from 'react'
import { Printer, Search, Coffee } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { productManager } from '../utils/productManager'
import '../styles/SalesTerminal.css'

const SalesTerminal = ({ user }) => {
  const [cart, setCart] = useState([])
  const [stock, setStock] = useState({})
  const [searchTerm, setSearchTerm] = useState('')
  const [products, setProducts] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [categories, setCategories] = useState([])

  useEffect(() => {
    // Charger le stock
    const savedStock = localStorage.getItem('cafeStock')
    if (savedStock) {
      setStock(JSON.parse(savedStock))
    } else {
      // Stock initial étendu avec les nouveaux ingrédients
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
      setStock(initialStock)
      localStorage.setItem('cafeStock', JSON.stringify(initialStock))
    }

    // Charger les produits
    loadProducts()
  }, [])

  const loadProducts = () => {
    const productsList = productManager.getProducts()
    setProducts(productsList)
    
    // Générer les catégories dynamiquement
    const uniqueCategories = ['all']
    productsList.forEach(product => {
      if (!uniqueCategories.includes(product.category)) {
        uniqueCategories.push(product.category)
      }
    })
    setCategories(uniqueCategories)
  }

  // Filtrer les produits par recherche et catégorie
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const getCategoryDisplayName = (category) => {
    const categoryInfo = productManager.getCategoryInfo(category)
    return categoryInfo?.name || category
  }

  const getCategoryIcon = (category) => {
    const categoryInfo = productManager.getCategoryInfo(category)
    return categoryInfo?.icon || '⚪'
  }

  const addToCart = (product) => {
    // Vérifier le stock avant d'ajouter
    const canAdd = checkProductStock(product)
    if (!canAdd) {
      const missingIngredients = []
      for (const ingredient in product.ingredients) {
        const needed = product.ingredients[ingredient]
        if (!stock[ingredient] || stock[ingredient].quantity < needed) {
          missingIngredients.push(stock[ingredient]?.name || ingredient)
        }
      }
      toast.error(`Stock insuffisant: ${missingIngredients.join(', ')}`)
      return
    }

    setCart(prev => {
      const existing = prev.find(item => item.id === product.id)
      if (existing) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      return [...prev, { ...product, quantity: 1 }]
    })
    toast.success(`${product.name} ajouté au panier`)
  }

  const checkProductStock = (product) => {
    for (const ingredient in product.ingredients) {
      const needed = product.ingredients[ingredient]
      if (!stock[ingredient] || stock[ingredient].quantity < needed) {
        return false
      }
    }
    return true
  }

  const updateQuantity = (id, change) => {
    setCart(prev => prev.map(item =>
      item.id === id
        ? { ...item, quantity: Math.max(0, item.quantity + change) }
        : item
    ).filter(item => item.quantity > 0))
  }

  const removeFromCart = (id) => {
    const product = cart.find(item => item.id === id)
    setCart(prev => prev.filter(item => item.id !== id))
    toast.success(`${product?.name} supprimé du panier`)
  }

  const clearCart = () => {
    if (cart.length === 0) {
      toast.error('Le panier est déjà vide')
      return
    }

    if (window.confirm('Voulez-vous vraiment vider tout le panier ?')) {
      setCart([])
      toast.success('Panier vidé')
    }
  }

  const checkStock = () => {
    for (const item of cart) {
      for (const ingredient in item.ingredients) {
        const needed = item.ingredients[ingredient] * item.quantity
        if (!stock[ingredient] || stock[ingredient].quantity < needed) {
          toast.error(`Stock insuffisant de ${stock[ingredient]?.name || ingredient}`)
          return false
        }
      }
    }
    return true
  }

  const processSale = () => {
    if (cart.length === 0) {
      toast.error('Panier vide')
      return
    }

    if (!checkStock()) return

    // Mettre à jour le stock
    const newStock = { ...stock }
    cart.forEach(item => {
      for (const ingredient in item.ingredients) {
        if (newStock[ingredient]) {
          newStock[ingredient].quantity -= item.ingredients[ingredient] * item.quantity
        }
      }
    })
    setStock(newStock)
    localStorage.setItem('cafeStock', JSON.stringify(newStock))

    // Sauvegarder la vente
    const sale = {
      id: Date.now(),
      date: new Date().toISOString(),
      items: cart,
      total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    }

    const salesHistory = JSON.parse(localStorage.getItem('salesHistory')) || []
    salesHistory.push(sale)
    localStorage.setItem('salesHistory', JSON.stringify(salesHistory))

    // Générer le reçu
    generateReceipt(sale)

    toast.success('Vente enregistrée avec succès!')
    setCart([])
  }

  const generateReceipt = (sale) => {
    const receiptWindow = window.open('', '_blank')
    receiptWindow.document.write(`
      <html>
        <head>
          <title>Reçu Magaly Café</title>
          <style>
            body { 
              font-family: 'Courier New', monospace; 
              padding: 20px; 
              max-width: 300px; 
              margin: 0 auto;
              background: white;
            }
            .header { 
              text-align: center; 
              margin-bottom: 20px;
              border-bottom: 2px dashed #000;
              padding-bottom: 10px;
            }
            .header h2 {
              margin: 0;
              color: #8B4513;
            }
            .item { 
              display: flex; 
              justify-content: space-between; 
              margin: 8px 0;
              padding: 4px 0;
            }
            .item-name {
              flex: 2;
            }
            .item-quantity {
              flex: 1;
              text-align: center;
            }
            .item-price {
              flex: 1;
              text-align: right;
            }
            .total { 
              border-top: 2px dashed #000; 
              margin-top: 15px; 
              padding-top: 10px; 
              font-weight: bold;
              font-size: 1.1em;
            }
            .footer { 
              text-align: center; 
              margin-top: 20px; 
              font-size: 0.9em;
              color: #666;
            }
            .thank-you {
              font-style: italic;
              margin-top: 10px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h2>MAGALY CAFÉ</h2>
            <p>${new Date(sale.date).toLocaleString('fr-FR')}</p>
          </div>
          ${sale.items.map(item => `
            <div class="item">
              <div class="item-name">${item.name}</div>
              <div class="item-quantity">x${item.quantity}</div>
              <div class="item-price">${(item.price * item.quantity).toFixed(0)} FCFA</div>
            </div>
          `).join('')}
          <div class="item total">
            <div>TOTAL</div>
            <div>${sale.total.toFixed(0)} FCFA</div>
          </div>
          <div class="footer">
            <p>Merci de votre visite !</p>
            <p class="thank-you">À bientôt au Magaly Café</p>
          </div>
        </body>
      </html>
    `)
    receiptWindow.document.close()
  }

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)

  const getProductStockStatus = (product) => {
    for (const ingredient in product.ingredients) {
      if (!stock[ingredient] || stock[ingredient].quantity < product.ingredients[ingredient]) {
        return 'out-of-stock'
      }
    }
    return 'in-stock'
  }

  const getProductCategoryInfo = (product) => {
    return productManager.getCategoryInfo(product.category)
  }

  return (
    <div className="sales-terminal">
      <div className="products-section">
        {/* Barre de recherche et filtres */}
        <div className="search-filters">
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
          
          <div className="category-filters">
            {categories.map(category => (
              <button
                key={category}
                className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category)}
                style={{
                  borderColor: selectedCategory === category ? productManager.getCategoryInfo(category)?.color : '#ddd'
                }}
              >
                <span className="category-btn-icon">
                  {category === 'all' ? '📦' : getCategoryIcon(category)}
                </span>
                <span className="category-btn-text">
                  {category === 'all' ? 'Tous' : getCategoryDisplayName(category)}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Compteur de résultats */}
        <div className="results-info">
          <span className="results-count">
            {filteredProducts.length} produit(s) trouvé(s)
            {selectedCategory !== 'all' && ` dans ${getCategoryDisplayName(selectedCategory).toLowerCase()}`}
            {searchTerm && ` pour "${searchTerm}"`}
          </span>
        </div>

        {/* Grille des produits */}
        <div className="products-grid">
          {filteredProducts.map(product => {
            const stockStatus = getProductStockStatus(product)
            const categoryInfo = getProductCategoryInfo(product)
            
            return (
              <div 
                key={product.id} 
                className={`product-card ${stockStatus}`}
                onClick={() => stockStatus === 'in-stock' && addToCart(product)}
                style={{
                  borderLeftColor: categoryInfo?.color || '#8B4513'
                }}
              >
                <div className="product-header">
                  <div className="product-name">{product.name}</div>
                  <div className="product-category-tag" style={{ backgroundColor: categoryInfo?.color }}>
                    {categoryInfo?.icon}
                  </div>
                </div>
                
                <div className="product-price">{product.price.toFixed(0)} FCFA</div>
                
                <div className="product-ingredients">
                  {Object.entries(product.ingredients).slice(0, 2).map(([key, quantity]) => (
                    <span key={key} className="ingredient-preview">
                      {quantity}{stock[key]?.unit} {stock[key]?.name}
                    </span>
                  ))}
                  {Object.keys(product.ingredients).length > 2 && (
                    <span className="more-ingredients">+{Object.keys(product.ingredients).length - 2}</span>
                  )}
                </div>

                {stockStatus === 'out-of-stock' && (
                  <div className="stock-badge">Rupture de stock</div>
                )}
                
                {product.isCustom && (
                  <div className="custom-badge">Personnalisé</div>
                )}
              </div>
            )
          })}
        </div>

        {filteredProducts.length === 0 && (
          <div className="no-products">
            <Coffee size={48} />
            <h3>Aucun produit trouvé</h3>
            <p>
              {searchTerm 
                ? `Aucun produit ne correspond à "${searchTerm}"`
                : `Aucun produit dans la catégorie ${getCategoryDisplayName(selectedCategory).toLowerCase()}`
              }
            </p>
            {(searchTerm || selectedCategory !== 'all') && (
              <button 
                className="clear-filters-btn"
                onClick={() => {
                  setSearchTerm('')
                  setSelectedCategory('all')
                }}
              >
                Afficher tous les produits
              </button>
            )}
          </div>
        )}
      </div>

      <div className="cart-section">
        <div className="cart-header">
          <h3>Commande en Cours</h3>
          {cart.length > 0 && (
            <span className="cart-count">{cart.length} article(s)</span>
          )}
        </div>
        
        <div className="cart-items">
          {cart.length === 0 ? (
            <div className="empty-cart">
              <Coffee size={32} />
              <p>Votre panier est vide</p>
              <small>Ajoutez des produits pour commencer</small>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.id} className="cart-item">
                <div className="item-main-info">
                  <div className="item-info">
                    <span className="item-name">{item.name}</span>
                    <span className="item-price">{item.price.toFixed(0)} FCFA l'unité</span>
                    {item.isCustom && <small className="custom-tag">Personnalisé</small>}
                  </div>
                  <div className="item-total">
                    {(item.price * item.quantity).toFixed(0)} FCFA
                  </div>
                </div>
                
                <div className="quantity-controls">
                  <div className="quantity-buttons">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation()
                        updateQuantity(item.id, -1)
                      }}
                      className="quantity-btn decrease"
                      title="Réduire la quantité"
                    >
                      -
                    </button>
                    <span className="quantity">{item.quantity}</span>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation()
                        updateQuantity(item.id, 1)
                      }}
                      className="quantity-btn increase"
                      title="Augmenter la quantité"
                    >
                      +
                    </button>
                  </div>
                  <button 
                    className="remove-btn"
                    onClick={(e) => {
                      e.stopPropagation()
                      removeFromCart(item.id)
                    }}
                    title="Supprimer le produit"
                  >
                    ×
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="cart-total">
            <div className="total-amount">
              <span className="total-label">Total:</span>
              <span className="total-value">{total.toFixed(0)} FCFA</span>
            </div>
            
            <div className="cart-summary">
              <div className="summary-item">
                <span>Articles:</span>
                <span>{cart.reduce((sum, item) => sum + item.quantity, 0)}</span>
              </div>
              <div className="summary-item">
                <span>Produits différents:</span>
                <span>{cart.length}</span>
              </div>
            </div>
            
            <div className="cart-actions">
              <button className="checkout-btn" onClick={processSale}>
                <Printer size={20} />
                Finaliser la Vente & Imprimer
              </button>
              
              <button className="clear-cart-btn" onClick={clearCart}>
                Vider le Panier
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default SalesTerminal