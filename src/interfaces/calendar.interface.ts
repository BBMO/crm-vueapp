import type { CommonSelectInterface } from 'src/interfaces/app.interface';

export interface CalendarDropdownInterface {
  id: string
  name: string
  color?: string
  selected?: boolean
}

export interface CalendarEventInterface {
  id: string
  title: string
  start: string
  end: string
  backgroundColor: string
  textColor: string
  categoryId: string
}

export interface CalendarEventFormInterface {
  title: string
  category: CommonSelectInterface
  startDate: string
  endDate: string
  location: string
  description: string
  agent?: CommonSelectInterface
}

export interface CalendarEventDetailsInterface {
  id: string
  title: string
  category: string
  start: string
  end: string
  location: string
  description: string
}
