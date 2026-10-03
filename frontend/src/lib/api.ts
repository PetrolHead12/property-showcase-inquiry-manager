
import axios from "axios";
import type {
  Property,
  PropertyListItem,
  PropertyCreateInput,
  PropertyUpdateInput,
  PropertyFilters,
  Inquiry,
  InquiryCreateInput,
  InquiryWithProperty,
} from "./types";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

export const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// Surface backend validation errors (FastAPI 422 "detail" arrays) as a
// single readable string so components don't each re-implement this.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const detail = error?.response?.data?.detail;
    let message = "Something went wrong. Please try again.";
    if (typeof detail === "string") {
      message = detail;
    } else if (Array.isArray(detail)) {
      message = detail
        .map((d: { loc?: string[]; msg: string }) => `${(d.loc ?? []).slice(-1)[0]}: ${d.msg}`)
        .join("; ");
    }
    return Promise.reject(new Error(message));
  }
);

// ---------- Properties ----------

export async function fetchProperties(filters: PropertyFilters = {}): Promise<PropertyListItem[]> {
  const params: Record<string, string | number> = {};
  if (filters.location) params.location = filters.location;
  if (filters.bedrooms !== undefined) params.bedrooms = filters.bedrooms;
  if (filters.minPrice) params.min_price = filters.minPrice;
  if (filters.maxPrice) params.max_price = filters.maxPrice;
  if (filters.status) params.status = filters.status;
  if (filters.sortBy) params.sort_by = filters.sortBy;
  if (filters.sortDir) params.sort_dir = filters.sortDir;

  const { data } = await api.get<PropertyListItem[]>("/properties", { params });
  return data;
}

export async function fetchProperty(id: number | string): Promise<Property> {
  const { data } = await api.get<Property>(`/properties/${id}`);
  return data;
}

export async function createProperty(payload: PropertyCreateInput): Promise<Property> {
  const { data } = await api.post<Property>("/properties", payload);
  return data;
}

export async function updateProperty(
  id: number | string,
  payload: PropertyUpdateInput
): Promise<Property> {
  const { data } = await api.put<Property>(`/properties/${id}`, payload);
  return data;
}

export async function deleteProperty(id: number | string): Promise<void> {
  await api.delete(`/properties/${id}`);
}

// ---------- Inquiries ----------

export async function submitInquiry(
  propertyId: number | string,
  payload: InquiryCreateInput
): Promise<Inquiry> {
  const { data } = await api.post<Inquiry>(`/properties/${propertyId}/inquiries`, payload);
  return data;
}

export async function fetchInquiries(propertyId?: number | string): Promise<InquiryWithProperty[]> {
  const params = propertyId ? { property_id: propertyId } : {};
  const { data } = await api.get<InquiryWithProperty[]>("/inquiries", { params });
  return data;
}