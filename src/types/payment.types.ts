export interface PaymentChannelOption {
  id: string;
  name: string;
  type: 'gateway_pending' | 'manual_verification' | 'pay_at_office';
  description: string;
  statusLabel: string;
  available: boolean;
}
