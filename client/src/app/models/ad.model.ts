
  
export interface Ad {
  id: number;
  title: string;
  description: string;
  category?: string;
  price: number;

  contactName?: string;
  contactPhone?: string;

  createdAt?: string;

  imagePath?: string;

  latitude?: number;
  longitude?: number;
  locationName?: string;
}
