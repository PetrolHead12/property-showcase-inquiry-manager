

export type PropertyStatus = "available" | "under_offer" | "sold";

export interface PropertyImage {
  id: number;
  property_id: number;
  image_url: string;
  is_primary: boolean;
  display_order: number;
}

export interface PropertyImageInput {
  image_url: string;
  is_primary: boolean;
  display_order: number;
}

/** Lightweight shape returned by GET /properties (grid view) */
export interface PropertyListItem {
  id: number;
  name: string;
  location: string;
  price: number;
  size_sqft: number;
  bedrooms: number;
  status: PropertyStatus;
  primary_image_url: string | null;
}

/** Full shape returned by GET /properties/:id (detail view) */
export interface Property {
  id: number;
  name: string;
  location: string;
  price: number;
  size_sqft: number;
  bedrooms: number;
  description: string;
  status: PropertyStatus;
  created_at: string;
  updated_at: string;
  images: PropertyImage[];
}

/** Body for POST /properties*/
 export  interface PropertyCreateInput {
  name: string;
  location: string;
  price: number;
  size_sqft: number;
  bedrooms: number;
  description: string;
  status: PropertyStatus;
  images: PropertyImageInput[];
}

/** Body for PUT /properties/:id — all fields optional (partial update) */
export type PropertyUpdateInput = Partial<PropertyCreateInput>;

export interface PropertyFilters {
  location?: string;
  bedrooms?: number;
  minPrice?: number;
  maxPrice?: number;
  status?: PropertyStatus;
  sortBy?: "price" | "bedrooms" | "size_sqft" | "created_at";
  sortDir?: "asc" | "desc";
}

export interface InquiryCreateInput {
  name: string;
  email: string;
  phone: string;
  message: string;
}

export interface Inquiry {
  id: number;
  property_id: number;
  name: string;
  email: string;
  phone: string;
  message: string;
  created_at: string;
}

export interface InquiryWithProperty extends Inquiry {
  property_name: string;
  property_location: string;
}
