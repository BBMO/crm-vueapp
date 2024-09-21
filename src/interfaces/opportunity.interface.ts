import type { CommonSelectInterface } from 'src/interfaces/app.interface';

export interface OpportunityFormInterface {
  contact_id: CommonSelectInterface
  property_id: CommonSelectInterface
  amount: string
  state_id: CommonSelectInterface
  finished: boolean
}

export interface OpportunityDetailsInterface {
  id: string
  agent: CommonSelectInterface
  amount: string
  contact: {
    id: string
    first_name: string
    last_name: string
  }
  property: {
    id: string
    title: string
    available_for: string
  }
  state: {
    id: string
    name: string
    color: string
  }
  finished_at: string | null
  finished?: boolean
}