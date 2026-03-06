export interface ParkingTicket {
  id: number;
  vehicle_id: number;
  vehicle?: {
    id: number;
    plate: string;
    owner_name: string;
    vehicle_type: 'car' | 'motorcycle' | 'truck';
  };
  parking_spot_id: number;
  parking_lot_id: number;
  parking_lot?: {
    id: number;
    name: string;
  };
  entry_time: string;
  exit_time: string | null;
  entry_guard_id: number;
  exit_guard_id: number | null;
  total_hours: number;
  hourly_rate_applied: number;
  total_amount: number;
  is_paid: boolean;
  payment_method: 'cash' | 'card' | 'transfer' | null;
  payment_time: string | null;
  is_active: boolean;
  created_at?: string;
}

export interface EntryVehicleRequest {
  vehicle_id?: number;
  plate?: string;
  vehicle_data?: {
    plate: string;
    owner_name: string;
    phone: string;
    vehicle_type: 'car' | 'motorcycle' | 'truck';
  };
  parking_lot_id: number;
  parking_spot_id: number;
  entry_time?: string;
}

export interface ExitVehicleRequest {
  ticket_id?: number;
  plate?: string;
  exit_time?: string;
}

