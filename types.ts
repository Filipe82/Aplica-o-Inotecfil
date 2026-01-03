export enum TicketStatus {
  PENDING = 'Pendente',
  IN_PROGRESS = 'Em Manutenção',
  AWAITING_PARTS = 'Aguardando Peças',
  READY = 'Pronto para Retirada',
  FINISHED = 'Finalizado',
  CANCELLED = 'Cancelado'
}

export enum Priority {
  LOW = 'Baixa',
  MEDIUM = 'Média',
  HIGH = 'Alta',
  URGENT = 'Urgente'
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address?: string;
}

export interface Technician {
  id: string;
  name: string;
  role: string;
  avatar?: string;
  location: string;
  activeOrders: number;
}

export interface Ticket {
  id: string;
  customerId: string;
  customerName: string;
  customerAddress?: string;
  customerPhone?: string;
  customerEmail?: string;
  technicianId?: string;
  technicianName?: string;
  deviceType: string;
  deviceBrand: string;
  deviceModel: string;
  problemDescription: string;
  status: TicketStatus;
  priority: Priority;
  createdAt: string;
  estimatedPrice?: number;
  diagnosis?: string;
  notes?: string;
  photos?: string[];
  isSolved?: boolean;
  solvedDescription?: string;
  resolutionDescription?: string;
}

export interface DashboardStats {
  totalTickets: number;
  pendingCount: number;
  inProgressCount: number;
  finishedCount: number;
  revenue: number;
}