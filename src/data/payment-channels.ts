import type { PaymentChannelOption } from '../types/payment.types';

const PAYMENT_CHANNELS: PaymentChannelOption[] = [
  {
    id: 'bank_transfer_verified',
    name: 'Bank Transfer (Manual Verification)',
    type: 'manual_verification',
    description:
      'Submit your booking reservation now and complete transfer using your Booking Reference. Payment status remains Unpaid until verified by ASRIVA Finance.',
    statusLabel: 'Available — Manual Verification',
    available: true
  },
  {
    id: 'office_settlement',
    name: 'Pay at ASRIVA Tour Desk / Counter',
    type: 'pay_at_office',
    description:
      'Hold your reservation slot and settle payment directly at our official tour counter with your Booking Reference.',
    statusLabel: 'Available — Reservation Hold',
    available: true
  },
  {
    id: 'online_gateway',
    name: 'Instant Payment Gateway (VA / QRIS / Card)',
    type: 'gateway_pending',
    description:
      'Direct automated payment gateway integration is currently not connected in this storefront environment.',
    statusLabel: 'Integration Not Available',
    available: false
  }
];
