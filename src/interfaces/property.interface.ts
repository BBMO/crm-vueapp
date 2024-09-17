export interface PropertyDropdownInterface {
  id: string
  name: string
}

export interface PropertyFeatureDropdownInterface {
  id: string
  name: string
  selected?: boolean
}

export interface PropertyImageInterface {
  src: string
  id?: string
  name?: string
  file?: any
}

export interface PropertyFiltersInterface {
  available_for: {
    label: string
    value: string
  },
  agent: PropertyDropdownInterface
  type: PropertyDropdownInterface
  state: PropertyDropdownInterface
  bedrooms: string
  bathrooms: string
  garages: string
  size: string
  address: string
  price: {
    min: number
    max: number
  },
  features: Array<string>
}
