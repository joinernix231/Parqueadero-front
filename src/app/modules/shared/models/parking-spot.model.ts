export interface ParkingSpot {
  id: number;
  parking_lot_id: number;
  spot_number: string;
  spot_type: 'regular' | 'disabled' | 'vip';
  is_occupied: boolean;
  is_active: boolean;
  is_available?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface ParkingSpotFormData {
  parking_lot_id: number;
  spot_number: string;
  spot_type: 'regular' | 'disabled' | 'vip';
  is_active: boolean;
}





