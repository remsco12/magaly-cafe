import { useCallback } from 'react'

export const useStockAlert = () => {
  const checkStockAlerts = useCallback(() => {
    try {
      const stock = JSON.parse(localStorage.getItem('cafeStock')) || {}
      const alerts = []

      Object.entries(stock).forEach(([key, item]) => {
        if (item.quantity <= item.alert) {
          alerts.push({
            type: 'warning',
            message: `Stock faible: ${item.name} (${item.quantity}${item.unit} restant)`,
            item: key
          })
        }
      })

      return alerts
    } catch (error) {
      console.error('Erreur lors de la vérification du stock:', error)
      return []
    }
  }, [])

  return { checkStockAlerts }
}