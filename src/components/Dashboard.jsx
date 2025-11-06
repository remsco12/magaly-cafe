import React, { useState, useEffect } from 'react'
import { TrendingUp, Users, Coffee, AlertTriangle } from 'lucide-react'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'
import { toast } from 'react-hot-toast'
import '../styles/Dashboard.css'

const Dashboard = ({ user }) => {
  const [stats, setStats] = useState({
    dailyRevenue: 0,
    totalSales: 0,
    popularProduct: '',
    lowStockItems: 0
  })

  const [salesData, setSalesData] = useState([])
  const [productData, setProductData] = useState([])

  const COLORS = ['#8B4513', '#D2691E', '#A0522D', '#CD853F', '#DEB887']

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = () => {
    try {
      // Simuler des données depuis le localStorage
      const salesHistory = JSON.parse(localStorage.getItem('salesHistory')) || []
      const stock = JSON.parse(localStorage.getItem('cafeStock')) || {}

      // Calculer les statistiques
      const today = new Date().toDateString()
      const todaySales = salesHistory.filter(sale => 
        new Date(sale.date).toDateString() === today
      )
      
      const dailyRevenue = todaySales.reduce((sum, sale) => sum + sale.total, 0)
      const totalSales = salesHistory.length
      
      // Produit populaire
      const productCount = {}
      salesHistory.forEach(sale => {
        sale.items.forEach(item => {
          productCount[item.name] = (productCount[item.name] || 0) + 1
        })
      })
      
      const popularProduct = Object.keys(productCount).length > 0 
        ? Object.keys(productCount).reduce((a, b) => 
            productCount[a] > productCount[b] ? a : b, ''
          )
        : 'Aucune vente'

      // Articles en stock faible
      const lowStockItems = Object.values(stock).filter(item => 
        item.quantity <= item.alert
      ).length

      setStats({
        dailyRevenue,
        totalSales,
        popularProduct,
        lowStockItems
      })

      // Données pour les graphiques
      const weeklyData = generateWeeklyData(salesHistory)
      setSalesData(weeklyData)

      const productSales = Object.entries(productCount).map(([name, count], index) => ({
        name,
        value: count,
        color: COLORS[index % COLORS.length]
      }))
      setProductData(productSales)
    } catch (error) {
      console.error('Erreur chargement dashboard:', error)
      toast.error('Erreur lors du chargement des données')
    }
  }

  const generateWeeklyData = (sales) => {
    const days = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']
    return days.map(day => ({
      name: day,
      revenue: Math.floor(Math.random() * 500) + 100,
      sales: Math.floor(Math.random() * 50) + 10
    }))
  }

  const StatCard = ({ icon: Icon, title, value, subtitle, color }) => (
    <div className="stat-card">
      <div className="stat-icon" style={{ backgroundColor: color }}>
        <Icon size={24} color="white" />
      </div>
      <div className="stat-content">
        <h3>{title}</h3>
        <div className="stat-value">{value}</div>
        <div className="stat-subtitle">{subtitle}</div>
      </div>
    </div>
  )

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>Tableau de Bord</h2>
        <p>Bienvenue {user?.name}, voici l'aperçu des performances</p>
      </div>

      {/* Cartes de statistiques */}
      <div className="stats-grid">
        <StatCard
          icon={TrendingUp}
          title="Revenue Aujourd'hui"
          value={`${stats.dailyRevenue.toFixed(0)} FCFA`}
          subtitle="+12% vs hier"
          color="#10B981"
        />
        <StatCard
          icon={Users}
          title="Total Ventes"
          value={stats.totalSales}
          subtitle="Ce mois"
          color="#3B82F6"
        />
        <StatCard
          icon={Coffee}
          title="Produit Populaire"
          value={stats.popularProduct}
          subtitle="Le plus vendu"
          color="#8B5CF6"
        />
        <StatCard
          icon={AlertTriangle}
          title="Alertes Stock"
          value={stats.lowStockItems}
          subtitle="Attention nécessaire"
          color="#EF4444"
        />
      </div>

      {/* Graphiques */}
      <div className="charts-grid">
        <div className="chart-card">
          <h3>Revenue Hebdomadaire</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip 
                formatter={(value) => [`${value} FCFA`, 'Revenue']}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="revenue" 
                stroke="#8B4513" 
                strokeWidth={2} 
                name="Revenue (FCFA)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h3>Ventes par Produit</h3>
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
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Alertes rapides */}
      {stats.lowStockItems > 0 && (
        <div className="alert-banner">
          <AlertTriangle size={20} />
          <span>{stats.lowStockItems} article(s) nécessitent une réapprovisionnement</span>
        </div>
      )}

      {stats.totalSales === 0 && (
        <div className="welcome-message">
          <h3>Bienvenue dans Magaly Café !</h3>
          <p>Commencez par ajouter des produits en stock et effectuez votre première vente.</p>
        </div>
      )}
    </div>
  )
}

export default Dashboard