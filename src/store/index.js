// store/modules/notifications.js

import axios from 'axios';

export default {
  namespaced: true,
  state: {
    notifications: [],
  },
  mutations: {
    SET_NOTIFICATIONS(state, notifications) {
      state.notifications = notifications;
    },
    MARK_AS_READ(state, notificationId) {
      const notification = state.notifications.find(n => n.id === notificationId);
      if (notification) {
        notification.read_at = new Date().toISOString();
      }
    },
  },
  actions: {
    fetchNotifications({ commit }) {
      axios.get('http://127.0.0.1:8000/api/notifications')
        .then(response => {
          commit('SET_NOTIFICATIONS', response.data);
        });
    },
    markAsRead({ commit }, notificationId) {
      axios.put(`http://127.0.0.1:8000/api/notifications/${notificationId}/mark-as-read`)
        .then(() => {
          commit('MARK_AS_READ', notificationId);
        });
    },
  },
  getters: {
    unreadCount: state => state.notifications.filter(n => !n.read_at).length,
    all: state => state.notifications,
  },
};
