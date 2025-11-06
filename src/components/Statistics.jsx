import React, { useState, useEffect } from 'react'
import { Calendar, TrendingUp, DollarSign, ShoppingCart, Package, Filter } from 'lucide-react'
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend, AreaChart, Area } from 'recharts'
import { toast } from 'react-hot-toast'
import '../styles/Statistics.css'

const Statistics = () => {
  const [salesData, setSalesData] = useState([])
  const [timeRange, setTimeRange] = useState('week') // week, month, year
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalSales: 0,
    averageTicket: 0,
    bestProduct: '',
    bestCategory: ''
  })
  const [chartData, setChartData] = useState([])
  const [productData, setProductData] = useState([])
  const [categoryData, setCategoryData] = useState([])

  const COLORS = ['#8B4513', '#D2691E', '#A0522D', '#CD853F', '#DEB887', '#BC8F8F', '#F4A460', '#DAA520']

  useEffect(() => {
    loadStatistics()
  }, [timeRange])

  const loadStatistics = () => {
    try {
      const salesHistory = JSON.parse(localStorage.getItem('salesHistory')) || []
      const products = JSON.parse(localStorage.getItem('customProducts')) || []
      
      if (salesHistory.length === 0) {
        setStats({
          totalRevenue: 0,
          totalSales: 0,
          averageTicket: 0,
          bestProduct: 'Aucune vente',
          bestCategory: 'Aucune vente'
        })
        setChartData(generateEmptyData())
        setProductData([])
        setCategoryData([])
        return
      }

      // Filtrer les ventes selon la période
      const filteredSales = filterSalesByTimeRange(salesHistory, timeRange)
      
      // Calculer les statistiques générales
      calculateGeneralStats(filteredSales)
      
      // Générer les données pour les graphiques
      generateChartData(filteredSales)
      
      // Générer les données produits et catégories
      generateProductAndCategoryData(filteredSales, products)
      
    } catch (error) {
      console.error('Erreur chargement statistiques:', error)
      toast.error('Erreur lors du chargement des statistiques')
    }
  }

  const filterSalesByTimeRange = (sales, range) => {
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
  }

  const calculateGeneralStats = (sales) => {
    const totalRevenue = sales.reduce((sum, sale) => sum + sale.total, 0)
    const totalSales = sales.reduce((sum, sale) => sum + sale.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0)
    const averageTicket = sales.length > 0 ? totalRevenue / sales.length : 0

    // Produit le plus vendu
    const productSales = {}
    const categorySales = {}
    
    sales.forEach(sale => {
      sale.items.forEach(item => {
        // Produits
        productSales[item.name] = (productSales[item.name] || 0) + item.quantity
        
        // Catégories (approximatif basé sur le nom)
        const category = getProductCategory(item.name)
        categorySales[category] = (categorySales[category] || 0) + item.quantity
      })
    })

    const bestProduct = Object.keys(productSales).length > 0 
      ? Object.keys(productSales).reduce((a, b) => productSales[a] > productSales[b] ? a : b)
      : 'Aucune vente'

    const bestCategory = Object.keys(categorySales).length > 0
      ? Object.keys(categorySales).reduce((a, b) => categorySales[a] > categorySales[b] ? a : b)
      : 'Aucune vente'

    setStats({
      totalRevenue,
      totalSales,
      averageTicket,
      bestProduct,
      bestCategory
    })
  }

  const getProductCategory = (productName) => {
    const name = productName.toLowerCase()
    if (name.includes('espresso') || name.includes('ristretto')) return 'Espresso'
    if (name.includes('cappuccino') || name.includes('latte') || name.includes('lait')) return 'Lactés'
    if (name.includes('filtre') || name.includes('americano')) return 'Filtre'
    if (name.includes('thé') || name.includes('infusion')) return 'Thés'
    if (name.includes('spécial') || name.includes('mocha') || name.includes('caramel')) return 'Spécialités'
    return 'Autres'
  }

  const generateChartData = (sales) => {
    switch (timeRange) {
      case 'week':
        setChartData(generateWeeklyData(sales))
        break
      case 'month':
        setChartData(generateMonthlyData(sales))
        break
      case 'year':
        setChartData(generateYearlyData(sales))
        break
      default:
        setChartData(generateWeeklyData(sales))
    }
  }

  const generateWeeklyData = (sales) => {
    const days = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']
    const dailyData = {}
    
    // Initialiser tous les jours à 0
    days.forEach(day => {
      dailyData[day] = { revenue: 0, sales: 0 }
    })

    // Compter les ventes par jour
    sales.forEach(sale => {
      const saleDate = new Date(sale.date)
      const dayIndex = saleDate.getDay()
      const dayName = days[dayIndex === 0 ? 6 : dayIndex - 1] // Lundi = 0
      
      dailyData[dayName].revenue += sale.total
      dailyData[dayName].sales += sale.items.reduce((sum, item) => sum + item.quantity, 0)
    })

    return days.map(day => ({
      name: day,
      revenue: dailyData[day].revenue,
      sales: dailyData[day].sales
    }))
  }

  const generateMonthlyData = (sales) => {
    const monthlyData = {}
    
    // Regrouper par jour du mois
    sales.forEach(sale => {
      const saleDate = new Date(sale.date)
      const day = saleDate.getDate()
      
      if (!monthlyData[day]) {
        monthlyData[day] = { revenue: 0, sales: 0 }
      }
      
      monthlyData[day].revenue += sale.total
      monthlyData[day].sales += sale.items.reduce((sum, item) => sum + item.quantity, 0)
    })

    // Convertir en tableau pour le graphique
    return Object.entries(monthlyData).map(([day, data]) => ({
      name: `J${day}`,
      revenue: data.revenue,
      sales: data.sales
    }))
  }

  const generateYearlyData = (sales) => {
    const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc']
    const monthlyData = {}
    
    // Initialiser tous les mois
    months.forEach(month => {
      monthlyData[month] = { revenue: 0, sales: 0 }
    })

    // Compter les ventes par mois
    sales.forEach(sale => {
      const saleDate = new Date(sale.date)
      const monthIndex = saleDate.getMonth()
      const monthName = months[monthIndex]
      
      monthlyData[monthName].revenue += sale.total
      monthlyData[monthName].sales += sale.items.reduce((sum, item) => sum + item.quantity, 0)
    })

    return months.map(month => ({
      name: month,
      revenue: monthlyData[month].revenue,
      sales: monthlyData[month].sales
    }))
  }

  const generateEmptyData = () => {
    if (timeRange === 'week') {
      return ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map(day => ({
        name: day,
        revenue: 0,
        sales: 0
      }))
    } else if (timeRange === 'month') {
      return Array.from({ length: 30 }, (_, i) => ({
        name: `J${i + 1}`,
        revenue: 0,
        sales: 0
      }))
    } else {
      return ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'].map(month => ({
        name: month,
        revenue: 0,
        sales: 0
      }))
    }
  }

  const generateProductAndCategoryData = (sales, products) => {
    const productSales = {}
    const categorySales = {}
    
    // Compter les ventes par produit et catégorie
    sales.forEach(sale => {
      sale.items.forEach(item => {
        // Produits
        productSales[item.name] = (productSales[item.name] || 0) + item.quantity
        
        // Catégories
        const category = getProductCategory(item.name)
        categorySales[category] = (categorySales[category] || 0) + item.quantity
      })
    })

    // Données pour le graphique produits
    const productChartData = Object.entries(productSales)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 8)
      .map(([name, value]) => ({ name, value }))

    // Données pour le graphique catégories
    const categoryChartData = Object.entries(categorySales)
      .map(([name, value]) => ({ name, value }))

    setProductData(productChartData)
    setCategoryData(categoryChartData)
  }

  const StatCard = ({ icon: Icon, title, value, subtitle, color, format }) => (
    <div className="stat-card">
      <div className="stat-icon" style={{ backgroundColor: color }}>
        <Icon size={24} color="white" />
      </div>
      <div className="stat-content">
        <h3>{title}</h3>
        <div className="stat-value">
          {format === 'currency' ? `${Number(value).toFixed(0)} FCFA` : 
           format === 'number' ? Number(value).toLocaleString() : value}
        </div>
        <div className="stat-subtitle">{subtitle}</div>
      </div>
    </div>
  )

  const getTimeRangeLabel = () => {
    switch (timeRange) {
      case 'week': return 'cette semaine'
      case 'month': return 'ce mois'
      case 'year': return 'cette année'
      default: return 'cette période'
    }
  }

  return (
    <div className="statistics">
      <div className="stats-header">
        <div className="header-content">
          <h2>📊 Statistiques des Ventes</h2>
          <p>Analyse des performances commerciales</p>
        </div>
        
        <div className="time-filters">
          <Filter size={16} />
          <select 
            value={timeRange} 
            onChange={(e) => setTimeRange(e.target.value)}
            className="time-select"
          >
            <option value="week">Cette semaine</option>
            <option value="month">Ce mois</option>
            <option value="year">Cette année</option>
          </select>
        </div>
      </div>

      {/* Cartes de statistiques */}
      <div className="stats-grid">
        <StatCard
          icon={DollarSign}
          title="Chiffre d'Affaires"
          value={stats.totalRevenue}
          subtitle={`Total ${getTimeRangeLabel()}`}
          color="#10B981"
          format="currency"
        />
        <StatCard
          icon={ShoppingCart}
          title="Ventes Total"
          value={stats.totalSales}
          subtitle={`Articles vendus ${getTimeRangeLabel()}`}
          color="#3B82F6"
          format="number"
        />
        <StatCard
          icon={TrendingUp}
          title="Ticket Moyen"
          value={stats.averageTicket}
          subtitle="Par transaction"
          color="#8B5CF6"
          format="currency"
        />
        <StatCard
          icon={Package}
          title="Produit Populaire"
          value={stats.bestProduct}
          subtitle="Le plus vendu"
          color="#EF4444"
        />
      </div>

      {/* Graphiques principaux */}
      <div className="charts-grid">
        <div className="chart-card">
          <div className="chart-header">
            <h3>Évolution du Chiffre d'Affaires</h3>
            <span className="chart-period">{getTimeRangeLabel()}</span>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis 
                tickFormatter={(value) => `${(value/1000).toFixed(0)}k`}
              />
              <Tooltip 
                formatter={(value) => [`${Number(value).toFixed(0)} FCFA`, 'Revenue']}
                labelFormatter={(label) => `Période: ${label}`}
              />
              <Area 
                type="monotone" 
                dataKey="revenue" 
                stroke="#8B4513" 
                fill="#8B4513" 
                fillOpacity={0.3}
                name="Revenue (FCFA)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <div className="chart-header">
            <h3>Volume des Ventes</h3>
            <span className="chart-period">{getTimeRangeLabel()}</span>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar 
                dataKey="sales" 
                fill="#D2691E" 
                name="Articles vendus"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Graphiques secondaires */}
      <div className="secondary-charts">
        <div className="chart-card">
          <div className="chart-header">
            <h3>Top Produits</h3>
            <span className="chart-period">Les plus vendus</span>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={productData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {productData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value} ventes`, 'Quantité']} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <div className="chart-header">
            <h3>Ventes par Catégorie</h3>
            <span className="chart-period">Répartition</span>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categoryData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis type="category" dataKey="name" width={80} />
              <Tooltip />
              <Bar 
                dataKey="value" 
                fill="#A0522D" 
                name="Ventes"
                radius={[0, 4, 4, 0]}
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {stats.totalSales === 0 && (
        <div className="empty-stats">
          <div className="empty-icon">📊</div>
          <h3>Aucune donnée de vente</h3>
          <p>Les statistiques apparaîtront après vos premières ventes</p>
        </div>
      )}
    </div>
  )
}

export default Statistics