import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import type { OrderListItem } from '../api/types';
import { OrderCard } from './OrderCard';

const order: OrderListItem = {
  number: 'FR001676',
  type: 'CONSOLIDATION',
  service: null,
  status: 'IN_PROGRESS',
  statusLabel: 'In progress',
  pipelineColumn: 'IN_PROGRESS',
  hasAlert: false,
  alertReason: null,
  awaitingAction: false,
  scheduledAt: '2026-04-12T09:00:00.000Z',
  hub: { name: 'Markham', region: 'ON' },
  qtyLabel: '15 × Std + 3 × XL',
  declaredQty: 18,
  actualQty: null,
  carrier: 'Driver: User 5',
  destination: 'Toronto, ON',
  destinationNote: null,
  trailersCount: 2,
  nextStep: 'Loading · 2h 14m',
  nextStepUrgent: false,
  createdBy: {
    code: 'U1',
    name: 'User 1',
    role: 'ADMIN',
    avatarColor: '#5B21B6',
  },
  subOrders: [
    { number: 'FR001676-1', refNumber: 'REF-1001', pallets: 9, alert: null },
    { number: 'FR001676-2', refNumber: 'REF-1003', pallets: 6, alert: null },
  ],
  refNumber: null,
  commentCount: 0,
  photoCount: 0,
  invoiceNumber: null,
  totalCents: 128000,
  isDraft: false,
};

describe('OrderCard', () => {
  it('renders order number, hub and next step', () => {
    render(
      <MemoryRouter>
        <OrderCard order={order} />
      </MemoryRouter>,
    );
    expect(screen.getByText('FR001676')).toBeInTheDocument();
    expect(screen.getByText('Markham')).toBeInTheDocument();
    expect(screen.getByText(/Loading/)).toBeInTheDocument();
    expect(screen.getByTestId('order-card')).toHaveAttribute(
      'href',
      '/orders/FR001676',
    );
  });

  it('marks drafts as continue-editing', () => {
    render(
      <MemoryRouter>
        <OrderCard order={{ ...order, isDraft: true, status: 'DRAFT', nextStep: 'Continue editing' }} />
      </MemoryRouter>,
    );
    expect(screen.getByText(/Continue editing/)).toBeInTheDocument();
  });
});
