// Gestionnaire centralisé des produits
export const productManager = {
  // Catégories disponibles avec icônes et couleurs
  categories: {
    espresso: { name: 'Cafés Espresso', color: '#8B4513', icon: '☕' },
    filter: { name: 'Cafés Filtre', color: '#A0522D', icon: '🫖' },
    milk: { name: 'Boissons Lactées', color: '#DEB887', icon: '🥛' },
    special: { name: 'Spécialités', color: '#D2691E', icon: '🌟' },
    other: { name: 'Autres', color: '#CD853F', icon: '⚪' },
    custom: { name: 'Produits Personnalisés', color: '#6B7280', icon: '🛠️' }
  },

  // Produits de base organisés par catégories
  baseProducts: [
    // Cafés Espresso
    { id: 1, name: "Ristretto", basePrice: 2.5 * 650, category: "espresso", ingredients: { cafe: 7, eau: 25 } },
    { id: 2, name: "Espresso", basePrice: 2.8 * 650, category: "espresso", ingredients: { cafe: 7, eau: 30 } },
    { id: 3, name: "Espresso Lungo", basePrice: 3.2 * 650, category: "espresso", ingredients: { cafe: 7, eau: 50 } },
    
    // Cafés Filtre
    { id: 4, name: "Café Filtre", basePrice: 3.0 * 650, category: "filter", ingredients: { cafe: 10, eau: 180 } },
    { id: 5, name: "Americano", basePrice: 3.5 * 650, category: "filter", ingredients: { cafe: 10, eau: 150 } },
    
    // Boissons Lactées
    { id: 6, name: "Cappuccino", basePrice: 4.0 * 650, category: "milk", ingredients: { cafe: 7, lait: 150, eau: 30 } },
    { id: 7, name: "Cappuccino XL", basePrice: 5.0 * 650, category: "milk", ingredients: { cafe: 14, lait: 200, eau: 30 } },
    { id: 8, name: "Cortado", basePrice: 3.8 * 650, category: "milk", ingredients: { cafe: 7, lait: 70 } },
    { id: 9, name: "Café au Lait", basePrice: 3.5 * 650, category: "milk", ingredients: { cafe: 10, lait: 150 } },
    { id: 10, name: "Flat White", basePrice: 4.2 * 650, category: "milk", ingredients: { cafe: 14, lait: 150 } },
    { id: 11, name: "Lait Moussé", basePrice: 2.5 * 650, category: "milk", ingredients: { lait: 200 } },
    { id: 12, name: "Latte Macchiato", basePrice: 4.5 * 650, category: "milk", ingredients: { cafe: 7, lait: 200 } },
    { id: 13, name: "Latte Macchiato XL", basePrice: 5.5 * 650, category: "milk", ingredients: { cafe: 14, lait: 250 } },
    
    // Spécialités
    { id: 14, name: "Mocha", basePrice: 5.0 * 650, category: "special", ingredients: { cafe: 7, lait: 150, chocolat: 20 } },
    { id: 15, name: "Caramel Macchiato", basePrice: 5.5 * 650, category: "special", ingredients: { cafe: 7, lait: 180, caramel: 15 } },
    { id: 16, name: "Irish Coffee", basePrice: 6.0 * 650, category: "special", ingredients: { cafe: 10, whisky: 30, sucre: 5, creme: 30 } },
    
    // Autres
    { id: 17, name: "Eau Chaude", basePrice: 1.0 * 650, category: "other", ingredients: { eau: 200 } },
    { id: 18, name: "Thé Vert", basePrice: 2.0 * 650, category: "other", ingredients: { the_vert: 2, eau: 200 } },
    { id: 19, name: "Thé Noir", basePrice: 2.0 * 650, category: "other", ingredients: { the_noir: 2, eau: 200 } },
    { id: 20, name: "Infusion", basePrice: 2.0 * 650, category: "other", ingredients: { infusion: 2, eau: 200 } }
  ],

  // Récupérer tous les produits avec prix personnalisés
  getProducts() {
    try {
      const customPrices = JSON.parse(localStorage.getItem('productPrices')) || {}
      const customProducts = JSON.parse(localStorage.getItem('customProducts')) || []
      
      const baseProductsWithPrices = this.baseProducts.map(product => ({
        ...product,
        price: customPrices[product.id] || product.basePrice
      }))

      return [...baseProductsWithPrices, ...customProducts]
    } catch (error) {
      console.error('Erreur lors du chargement des produits:', error)
      return this.baseProducts.map(product => ({
        ...product,
        price: product.basePrice
      }))
    }
  },

  // Récupérer les produits groupés par catégorie
  getProductsByCategory() {
    const products = this.getProducts()
    const grouped = {}
    
    // Initialiser toutes les catégories
    Object.keys(this.categories).forEach(category => {
      grouped[category] = []
    })
    
    // Grouper les produits par catégorie
    products.forEach(product => {
      if (grouped[product.category]) {
        grouped[product.category].push(product)
      } else {
        // Si la catégorie n'existe pas, mettre dans "other"
        grouped['other'].push(product)
      }
    })
    
    return grouped
  },

  // Mettre à jour le prix d'un produit
  updatePrice(productId, newPrice) {
    try {
      const customPrices = JSON.parse(localStorage.getItem('productPrices')) || {}
      customPrices[productId] = parseFloat(newPrice)
      localStorage.setItem('productPrices', JSON.stringify(customPrices))
      return true
    } catch (error) {
      console.error('Erreur lors de la mise à jour du prix:', error)
      return false
    }
  },

  // Ajouter un produit personnalisé
  addCustomProduct(product) {
    try {
      const customProducts = JSON.parse(localStorage.getItem('customProducts')) || []
      const newProduct = {
        ...product,
        id: Date.now(), // ID unique
        isCustom: true,
        category: product.category || 'custom',
        basePrice: product.price // Sauvegarder le prix de base
      }
      customProducts.push(newProduct)
      localStorage.setItem('customProducts', JSON.stringify(customProducts))
      return newProduct
    } catch (error) {
      console.error('Erreur lors de l\'ajout du produit personnalisé:', error)
      return null
    }
  },

  // Supprimer un produit personnalisé
  removeCustomProduct(productId) {
    try {
      const customProducts = JSON.parse(localStorage.getItem('customProducts')) || []
      const updatedProducts = customProducts.filter(p => p.id !== productId)
      localStorage.setItem('customProducts', JSON.stringify(updatedProducts))
      return true
    } catch (error) {
      console.error('Erreur lors de la suppression du produit:', error)
      return false
    }
  },

  // Obtenir les informations d'une catégorie
  getCategoryInfo(category) {
    return this.categories[category] || { name: 'Autre', color: '#666', icon: '❓' }
  },

  // Obtenir toutes les catégories
  getAllCategories() {
    return this.categories
  },

  // Vérifier si un produit existe
  productExists(productName) {
    const products = this.getProducts()
    return products.some(product => 
      product.name.toLowerCase() === productName.toLowerCase()
    )
  },

  // Obtenir un produit par son ID
  getProductById(productId) {
    const products = this.getProducts()
    return products.find(product => product.id === productId)
  },

  // Obtenir les produits par catégorie
  getProductsByCategoryName(categoryName) {
    const products = this.getProducts()
    return products.filter(product => product.category === categoryName)
  },

  // Mettre à jour un produit personnalisé
  updateCustomProduct(productId, updatedProduct) {
    try {
      const customProducts = JSON.parse(localStorage.getItem('customProducts')) || []
      const productIndex = customProducts.findIndex(p => p.id === productId)
      
      if (productIndex !== -1) {
        customProducts[productIndex] = {
          ...customProducts[productIndex],
          ...updatedProduct,
          id: productId, // Garder le même ID
          isCustom: true
        }
        localStorage.setItem('customProducts', JSON.stringify(customProducts))
        return customProducts[productIndex]
      }
      return null
    } catch (error) {
      console.error('Erreur lors de la mise à jour du produit:', error)
      return null
    }
  },

  // Statistiques des produits
  getProductsStats() {
    const products = this.getProducts()
    const customProducts = JSON.parse(localStorage.getItem('customProducts')) || []
    
    return {
      totalProducts: products.length,
      baseProducts: this.baseProducts.length,
      customProducts: customProducts.length,
      categoriesCount: Object.keys(this.getProductsByCategory()).length
    }
  },

  // Obtenir les ingrédients utilisés par les produits
  getUsedIngredients() {
    const products = this.getProducts()
    const usedIngredients = new Set()
    
    products.forEach(product => {
      Object.keys(product.ingredients).forEach(ingredient => {
        usedIngredients.add(ingredient)
      })
    })
    
    return Array.from(usedIngredients)
  },

  // Vérifier la disponibilité d'un produit basé sur le stock
  checkProductAvailability(productId, stock) {
    const product = this.getProductById(productId)
    if (!product) return false

    for (const ingredient in product.ingredients) {
      const needed = product.ingredients[ingredient]
      if (!stock[ingredient] || stock[ingredient].quantity < needed) {
        return false
      }
    }
    return true
  },

  // Obtenir le coût des ingrédients d'un produit (pour calcul de marge)
  getProductCost(productId, ingredientPrices = {}) {
    const product = this.getProductById(productId)
    if (!product) return 0

    let totalCost = 0
    for (const ingredient in product.ingredients) {
      const quantity = product.ingredients[ingredient]
      const pricePerUnit = ingredientPrices[ingredient] || 0
      totalCost += quantity * pricePerUnit
    }
    
    return totalCost
  },

  // Calculer la marge d'un produit
  calculateProductMargin(productId, ingredientPrices = {}) {
    const product = this.getProductById(productId)
    if (!product) return 0

    const cost = this.getProductCost(productId, ingredientPrices)
    const revenue = product.price
    const margin = revenue - cost
    const marginPercentage = revenue > 0 ? (margin / revenue) * 100 : 0

    return {
      cost,
      revenue,
      margin,
      marginPercentage
    }
  },

  // Obtenir les statistiques des ventes
  getSalesStatistics(timeRange = 'week') {
    try {
      const salesHistory = JSON.parse(localStorage.getItem('salesHistory')) || []
      
      if (salesHistory.length === 0) {
        return {
          totalRevenue: 0,
          totalSales: 0,
          averageTicket: 0,
          totalTransactions: 0,
          chartData: [],
          productData: [],
          categoryData: [],
          bestSellingProducts: [],
          bestSellingCategories: []
        }
      }

      // Filtrer les ventes selon la période
      const filteredSales = this.filterSalesByTimeRange(salesHistory, timeRange)
      
      // Calculer les statistiques générales
      const stats = this.calculateSalesStats(filteredSales)
      
      // Générer les données pour les graphiques
      const chartData = this.generateSalesChartData(filteredSales, timeRange)
      
      // Générer les données produits et catégories
      const { productData, categoryData, bestSellingProducts, bestSellingCategories } = this.generateProductCategoryData(filteredSales)

      return {
        ...stats,
        chartData,
        productData,
        categoryData,
        bestSellingProducts: bestSellingProducts.slice(0, 5),
        bestSellingCategories: bestSellingCategories.slice(0, 5)
      }
    } catch (error) {
      console.error('Erreur lors du calcul des statistiques:', error)
      return this.getEmptyStats(timeRange)
    }
  },

  // Filtrer les ventes par période
  filterSalesByTimeRange(sales, range) {
    const now = new Date()
    let startDate

    switch (range) {
      case 'week':
        startDate = new Date(now.setDate(now.getDate() - 7))
        break
      case 'month':
        startDate = new Date(now.setMonth(now.getMonth() - 1))
        break
      case 'year':
        startDate = new Date(now.setFullYear(now.getFullYear() - 1))
        break
      default:
        startDate = new Date(0) // Toutes les dates
    }

    return sales.filter(sale => new Date(sale.date) >= startDate)
  },

  // Calculer les statistiques de vente
  calculateSalesStats(sales) {
    const totalRevenue = sales.reduce((sum, sale) => sum + sale.total, 0)
    const totalSales = sales.reduce((sum, sale) => sum + sale.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0)
    const totalTransactions = sales.length
    const averageTicket = totalTransactions > 0 ? totalRevenue / totalTransactions : 0

    return {
      totalRevenue,
      totalSales,
      totalTransactions,
      averageTicket
    }
  },

  // Générer les données pour les graphiques
  generateSalesChartData(sales, timeRange) {
    switch (timeRange) {
      case 'week':
        return this.generateWeeklyChartData(sales)
      case 'month':
        return this.generateMonthlyChartData(sales)
      case 'year':
        return this.generateYearlyChartData(sales)
      default:
        return this.generateWeeklyChartData(sales)
    }
  },

  generateWeeklyChartData(sales) {
    const days = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']
    const dailyData = {}
    
    days.forEach(day => {
      dailyData[day] = { revenue: 0, sales: 0, transactions: 0 }
    })

    sales.forEach(sale => {
      const saleDate = new Date(sale.date)
      const dayIndex = saleDate.getDay()
      const dayName = days[dayIndex === 0 ? 6 : dayIndex - 1]
      
      dailyData[dayName].revenue += sale.total
      dailyData[dayName].sales += sale.items.reduce((sum, item) => sum + item.quantity, 0)
      dailyData[dayName].transactions += 1
    })

    return days.map(day => ({
      name: day,
      revenue: dailyData[day].revenue,
      sales: dailyData[day].sales,
      transactions: dailyData[day].transactions
    }))
  },

  generateMonthlyChartData(sales) {
    const monthlyData = {}
    
    sales.forEach(sale => {
      const saleDate = new Date(sale.date)
      const day = saleDate.getDate()
      
      if (!monthlyData[day]) {
        monthlyData[day] = { revenue: 0, sales: 0, transactions: 0 }
      }
      
      monthlyData[day].revenue += sale.total
      monthlyData[day].sales += sale.items.reduce((sum, item) => sum + item.quantity, 0)
      monthlyData[day].transactions += 1
    })

    return Object.entries(monthlyData).map(([day, data]) => ({
      name: `J${day}`,
      revenue: data.revenue,
      sales: data.sales,
      transactions: data.transactions
    }))
  },

  generateYearlyChartData(sales) {
    const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc']
    const monthlyData = {}
    
    months.forEach(month => {
      monthlyData[month] = { revenue: 0, sales: 0, transactions: 0 }
    })

    sales.forEach(sale => {
      const saleDate = new Date(sale.date)
      const monthIndex = saleDate.getMonth()
      const monthName = months[monthIndex]
      
      monthlyData[monthName].revenue += sale.total
      monthlyData[monthName].sales += sale.items.reduce((sum, item) => sum + item.quantity, 0)
      monthlyData[monthName].transactions += 1
    })

    return months.map(month => ({
      name: month,
      revenue: monthlyData[month].revenue,
      sales: monthlyData[month].sales,
      transactions: monthlyData[month].transactions
    }))
  },

  // Générer les données produits et catégories
  generateProductCategoryData(sales) {
    const productSales = {}
    const categorySales = {}
    
    sales.forEach(sale => {
      sale.items.forEach(item => {
        // Produits
        productSales[item.name] = (productSales[item.name] || 0) + item.quantity
        
        // Catégories
        const category = this.getProductCategoryFromName(item.name)
        categorySales[category] = (categorySales[category] || 0) + item.quantity
      })
    })

    // Données pour les graphiques
    const productData = Object.entries(productSales)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 8)
      .map(([name, value]) => ({ name, value }))

    const categoryData = Object.entries(categorySales)
      .map(([name, value]) => ({ name, value }))

    // Meilleures ventes
    const bestSellingProducts = Object.entries(productSales)
      .sort(([,a], [,b]) => b - a)
      .map(([name, quantity]) => ({ name, quantity }))

    const bestSellingCategories = Object.entries(categorySales)
      .sort(([,a], [,b]) => b - a)
      .map(([name, quantity]) => ({ name, quantity }))

    return {
      productData,
      categoryData,
      bestSellingProducts,
      bestSellingCategories
    }
  },

  // Déterminer la catégorie d'un produit basé sur son nom
  getProductCategoryFromName(productName) {
    const name = productName.toLowerCase()
    if (name.includes('espresso') || name.includes('ristretto')) return 'Espresso'
    if (name.includes('cappuccino') || name.includes('latte') || name.includes('lait') || name.includes('moussé')) return 'Lactés'
    if (name.includes('filtre') || name.includes('americano') || name.includes('coffee')) return 'Filtre'
    if (name.includes('thé') || name.includes('infusion')) return 'Thés'
    if (name.includes('spécial') || name.includes('mocha') || name.includes('caramel') || name.includes('irish')) return 'Spécialités'
    return 'Autres'
  },

  // Obtenir des statistiques vides
  getEmptyStats(timeRange) {
    let emptyData = []
    
    if (timeRange === 'week') {
      emptyData = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map(day => ({
        name: day,
        revenue: 0,
        sales: 0,
        transactions: 0
      }))
    } else if (timeRange === 'month') {
      emptyData = Array.from({ length: 30 }, (_, i) => ({
        name: `J${i + 1}`,
        revenue: 0,
        sales: 0,
        transactions: 0
      }))
    } else {
      emptyData = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'].map(month => ({
        name: month,
        revenue: 0,
        sales: 0,
        transactions: 0
      }))
    }

    return {
      totalRevenue: 0,
      totalSales: 0,
      totalTransactions: 0,
      averageTicket: 0,
      chartData: emptyData,
      productData: [],
      categoryData: [],
      bestSellingProducts: [],
      bestSellingCategories: []
    }
  },

  // Réinitialiser tous les produits personnalisés
  resetCustomProducts() {
    try {
      localStorage.removeItem('customProducts')
      localStorage.removeItem('productPrices')
      return true
    } catch (error) {
      console.error('Erreur lors de la réinitialisation:', error)
      return false
    }
  },

  // Exporter les données produits
  exportProducts() {
    const products = this.getProducts()
    const customProducts = JSON.parse(localStorage.getItem('customProducts')) || []
    const productPrices = JSON.parse(localStorage.getItem('productPrices')) || {}
    
    return {
      baseProducts: this.baseProducts,
      customProducts,
      productPrices,
      categories: this.categories,
      exportDate: new Date().toISOString()
    }
  },

  // Importer des données produits
  importProducts(data) {
    try {
      if (data.customProducts) {
        localStorage.setItem('customProducts', JSON.stringify(data.customProducts))
      }
      if (data.productPrices) {
        localStorage.setItem('productPrices', JSON.stringify(data.productPrices))
      }
      return true
    } catch (error) {
      console.error('Erreur lors de l\'importation:', error)
      return false
    }
  }
}

export default productManager