export interface ParkingLot {
  id: number;
  name: string;
  address: string;
  total_spots: number;
  hourly_rate_day: number;
  hourly_rate_night: number;
  day_start_time: string;
  day_end_time: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface ParkingLotFormData {
  name: string;
  address: string;
  total_spots: number;
  hourly_rate_day: number;
  hourly_rate_night: number;
  day_start_time: string;
  day_end_time: string;
  is_active: boolean;
}





