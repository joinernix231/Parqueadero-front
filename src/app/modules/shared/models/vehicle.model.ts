export interface Vehicle {
  id: number;
  plate: string;
  owner_name: string;
  phone: string;
  vehicle_type: 'car' | 'motorcycle' | 'truck';
  created_at?: string;
}

export interface VehicleFormData {
  plate: string;
  owner_name: string;
  phone: string;
  vehicle_type: 'car' | 'motorcycle' | 'truck';
}





