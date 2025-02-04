export interface Consultation {
  id: string;
  consultation_date: string;
  consultation_type: string;
  notes?: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
}