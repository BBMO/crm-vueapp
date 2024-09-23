export interface CommonSelectInterface {
  id: string
  name: string
  selected?: boolean
}

export interface AppConfigInterface {
  id: string
  name: string
  properties?: string
  color?: string
}

export interface AppStatsInterface {
  title: string
  subtitle: string
  icon: string
  color: string
  quantity: number
  isAmount?: boolean
}
