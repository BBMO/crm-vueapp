import type { CommonSelectInterface } from 'src/interfaces/app.interface';

export interface PropertyDropdownInterface {
  label: string
  value: string
}

export interface PropertyImageInterface {
  src: string
  id?: string
  name?: string
  file?: any
}

export interface PropertyFiltersInterface {
  available_for: PropertyDropdownInterface
  status: PropertyDropdownInterface
  agent: CommonSelectInterface
  type: CommonSelectInterface
  bedrooms: string
  bathrooms: string
  garages: string
  size: {
    min: number
    max: number
  }
  address: string
  price: {
    min: number
    max: number
  }
  enabled: boolean
  features: Array<string>
}

export interface PropertyFormInterface {
  title: string
  description: string
  price: string
  available_for: PropertyDropdownInterface
  bedrooms: string
  bathrooms: string
  garages: string
  size: string
  address: string
  city: string
  state: string
  zip: string
  latitude: string
  longitude: string
  status: PropertyDropdownInterface
  agent_id: CommonSelectInterface
  type_id: CommonSelectInterface
  enabled: boolean
}
