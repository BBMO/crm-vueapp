import type { CommonSelectInterface } from 'src/interfaces/app.interface';

export interface ContactFormInterface {
  id?: string
  first_name: string
  last_name: string
  email: string
  phone: string
  address: string
  type: {
    label: string
    value: string
  }
  image: any
  attachment: any
  agent?: CommonSelectInterface
}

export interface ContactDetailsInterface {
  id: string
  first_name: string
  last_name: string
  email: string
  phone: string
  address: string
  type: string
  attachment_id: string
  attachment_url: string
  created_at: string
  updated_at: string
  features?: any
  agent?: {
    id: string
    name: string
    attachment_url: string
  }
}
