import type { AppNotification } from '../types/notification.types';

export const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'n1',
    title: 'Seasonal Promo Code Available',
    message: 'Apply code ASRIVA250 at booking for IDR 250.000 off orders above IDR 3.000.000.',
    time: 'Today',
    unread: true
  },
  {
    id: 'n2',
    title: 'Guest Checkout Enabled',
    message: 'Book any domestic or international package without creating an account.',
    time: '2 days ago',
    unread: false
  }
];
