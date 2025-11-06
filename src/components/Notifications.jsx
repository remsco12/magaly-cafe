import React from 'react'
import { Bell, CheckCircle, AlertTriangle, Info, X } from 'lucide-react'
import { toast } from 'react-hot-toast'
import '../styles/Notifications.css'

const Notifications = ({ notifications, setNotifications }) => {
  const markAsRead = (id) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    )
  }

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, read: true }))
    )
    toast.success('Toutes les notifications marquées comme lues')
  }

  const clearAll = () => {
    setNotifications([])
    toast.success('Notifications effacées')
  }

  const getIcon = (type) => {
    switch (type) {
      case 'success': return <CheckCircle className="icon success" />
      case 'warning': return <AlertTriangle className="icon warning" />
      case 'error': return <X className="icon error" />
      default: return <Info className="icon info" />
    }
  }

  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <div className="notifications">
      <div className="notifications-header">
        <div className="header-title">
          <Bell size={24} />
          <h2>Notifications</h2>
          {unreadCount > 0 && (
            <span className="unread-badge">{unreadCount}</span>
          )}
        </div>
        <div className="header-actions">
          <button onClick={markAllAsRead} className="action-btn">
            Tout marquer comme lu
          </button>
          <button onClick={clearAll} className="action-btn clear">
            Tout effacer
          </button>
        </div>
      </div>

      <div className="notifications-list">
        {notifications.length === 0 ? (
          <div className="empty-state">
            <Bell size={48} />
            <p>Aucune notification</p>
          </div>
        ) : (
          notifications.map(notification => (
            <div
              key={notification.id}
              className={`notification-item ${notification.read ? 'read' : 'unread'}`}
            >
              <div className="notification-icon">
                {getIcon(notification.type)}
              </div>
              <div className="notification-content">
                <p className="notification-message">{notification.message}</p>
                <span className="notification-time">
                  {new Date(notification.timestamp).toLocaleString()}
                </span>
              </div>
              {!notification.read && (
                <button
                  onClick={() => markAsRead(notification.id)}
                  className="mark-read-btn"
                >
                  Marquer comme lu
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default Notifications