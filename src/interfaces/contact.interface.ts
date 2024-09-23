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
}

export interface ContactDetailsInterface extends ContactFormInterface {
  attachment_id: string
  created_at: string
  updated_at: string
}
