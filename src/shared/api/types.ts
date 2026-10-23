export type UserRole = 'ADMIN' | 'DISPATCHER' | 'FLOOR_LEAD' | 'DRIVER';
export type OrderType = 'CROSS_DOCK' | 'CONSOLIDATION';
export type OrderStatus =
  | 'DRAFT'
  | 'NEW'
  | 'READY'
  | 'IN_PROGRESS'
  | 'ON_STOCK'
  | 'CONSOLIDATED'
  | 'IN_TRANSIT'
  | 'DECONSOLIDATED'
  | 'COMPLETED'
  | 'CLOSED';

export type PipelineColumn =
  'DRAFT' | 'READY' | 'IN_PROGRESS' | 'CONSOLIDATED' | 'IN_TRANSIT' | 'DECONSOLIDATED' | 'CLOSED';

export type OrderTab = 'all' | 'cross-dock' | 'consolidation' | 'alerts' | 'drafts';
export type DateRange = 'all' | 'today' | 'this-week' | 'last-30';
export type ActivityPeriod = 'day' | 'week' | 'month' | 'quarter';

export type UserRef = {
  code: string;
  name: string;
  role: UserRole;
  avatarColor?: string;
};

export type SubOrder = {
  number: string;
  refNumber: string;
  pallets: number;
  alert: string | null;
};

export type OrderListItem = {
  number: string;
  type: OrderType;
  service: string | null;
  status: OrderStatus;
  statusLabel: string;
  pipelineColumn: PipelineColumn;
  hasAlert: boolean;
  alertReason: string | null;
  awaitingAction: boolean;
  scheduledAt: string | null;
  hub: { name: string; region: string };
  qtyLabel: string | null;
  declaredQty: number | null;
  actualQty: number | null;
  carrier: string | null;
  destination: string | null;
  destinationNote: string | null;
  trailersCount: number | null;
  nextStep: string | null;
  nextStepUrgent: boolean;
  createdBy: UserRef;
  subOrders: SubOrder[];
  refNumber: string | null;
  commentCount: number;
  photoCount: number;
  invoiceNumber: string | null;
  totalCents: number;
  isDraft: boolean;
};

export type CargoLine = {
  qty: number;
  unit: 'STANDARD' | 'XL';
  unitSize: string | null;
};

export type DockAssignment = {
  dockNumber: number;
  bay: string;
  trailer: string | null;
  assignedAt: string;
  statusLabel: string;
  assignedTo: UserRef | null;
};

export type Operation = {
  type: 'UNLOADING' | 'DISPOSAL' | 'RESTACK' | 'LOADING';
  billable: boolean;
  trailer: string | null;
  qty: number;
  unit: string;
  appliedAt: string;
  commentCount: number;
  photoCount: number;
};

export type Supply = {
  sku: string;
  category: string;
  qty: number;
  unitCents: number;
  lineTotalCents: number;
};

export type OrderDetail = OrderListItem & {
  services: string[];
  customer: string | null;
  carrierPhone: string | null;
  trailerType: string | null;
  truck: string | null;
  trailer: string | null;
  warehouseNote: string | null;
  statusFlow: string | null;
  deltasCount: number;
  deltaLabel: string | null;
  requiredPhotos: number;
  completedAt: string | null;
  cargoLines: CargoLine[];
  dock: DockAssignment | null;
  operations: Operation[];
  supplies: Supply[];
  supplySubtotalCents: number;
};

export type Me = {
  code: string;
  name: string;
  role: UserRole;
  avatarColor: string;
  account: { company: string; balanceCents: number };
  notificationCount: number;
};

export type DashboardSummary = {
  active: { count: number; deltaThisWeek: number };
  completed30d: {
    count: number;
    previousCount: number;
    trend: 'up' | 'down' | 'same';
  };
  needAttention: {
    total: number;
    awaitingAction: number;
    alerts: { orderNumber: string; reason: string | null }[];
  };
};

export type ActivityPoint = { label: string; date: string };

export type ActivityResponse = {
  period: ActivityPeriod;
  completed: {
    total: number;
    series: (ActivityPoint & { value: number })[];
  };
  spend: {
    totalCents: number;
    series: (ActivityPoint & { valueCents: number })[];
  };
  insights: {
    completedChangePct: number;
    spentCents: number;
    avgCents: number;
    bestWeekLabel: string | null;
    bestWeekSpendCents: number;
  };
};

export type OrderListResponse = {
  items: OrderListItem[];
  total: number;
  page: number;
  limit: number;
  pages: number;
};

export type OrderCounts = {
  all: number;
  crossDock: number;
  consolidation: number;
  alerts: number;
  drafts: number;
};

export type OrderListQuery = {
  tab?: OrderTab;
  hub?: string;
  status?: OrderStatus | '';
  dateRange?: DateRange;
  search?: string;
  page?: number;
  limit?: number;
};
