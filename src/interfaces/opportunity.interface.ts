import type { CommonSelectInterface } from 'src/interfaces/app.interface';

export interface OpportunitySelectPropertyInterface {
  id: string
  name: string
  price: string
}

export interface OpportunityFormInterface {
  agent_id: CommonSelectInterface
  property_id: CommonSelectInterface
  contact_id: CommonSelectInterface
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
  }
  state: {
    id: string
    name: string
    color: string
  }
  purpose: string
  finished_at: string | null
  finished?: boolean
}
