export interface AgentFormInterface {
  username: string
  email: string
  password: string
  first_name: string
  last_name: string
  image: any
  attachment: any
}

export interface AgentDetailsInterface {
  id: string
  username: string
  email: string
  first_name: string
  last_name: string
  display_name: string
  avatar: any
  total_properties: number
  total_rent_amount: number
  total_rent_commissions: number
  total_sales_amount: number
  total_sales_commissions: number
}
