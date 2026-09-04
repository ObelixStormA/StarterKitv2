export interface NavItem {
  path: string
  label: string
  icon: string
  badge?: string | number
  /** Pro-only item: links out to the Pro demo instead of an in-app route */
  isPro?: boolean
}

export interface NavGroup {
  title: string
  items: NavItem[]
}
