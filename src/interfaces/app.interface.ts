export interface CommonSelectInterface {
  id: string
  name: string
  selected?: boolean
}

export interface AppStatsInterface {
  title: string
  subtitle: string
  icon: string
  color: string
  quantity: number
  isAmount?: boolean
}

export interface AppConfigInterface {
  id: string
  name: string
  properties?: string
  color?: string
}

export interface AppConfigEmailInterface {
  frequency: {
    label: string
    value: string
  }
  time: string
  is_active: boolean
}
