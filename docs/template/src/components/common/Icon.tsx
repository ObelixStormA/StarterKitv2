import { Icon as IconifyIcon } from '@iconify/react'

/**
 * Icon Component - Wrapper for Iconify Solar Icons
 * Provides a consistent API similar to Tabler Icons
 */

interface IconProps {
  icon: string
  className?: string
  width?: number | string
  height?: number | string
  style?: React.CSSProperties
}

export function Icon({ icon, className, width, height, style }: IconProps) {
  return (
    <IconifyIcon
      icon={icon}
      className={className}
      width={width}
      height={height}
      style={style}
    />
  )
}

// Export type for icon names
export type IconName = string

// Solar Icon Mappings - Using Linear and Bold variants
export const Icons = {
  // Navigation & Layout
  home: 'solar:home-2-linear',
  dashboard: 'solar:widget-linear',
  menu: 'solar:hamburger-menu-linear',
  menu2: 'solar:hamburger-menu-linear', // Alias for menu
  close: 'solar:close-circle-linear',
  chevronDown: 'solar:alt-arrow-down-linear',
  chevronUp: 'solar:alt-arrow-up-linear',
  chevronLeft: 'solar:alt-arrow-left-linear',
  chevronRight: 'solar:alt-arrow-right-linear',
  
  // Dashboard & Analytics
  chartLine: 'solar:chart-2-linear',
  chartBar: 'solar:chart-linear',
  chartPie: 'solar:pie-chart-2-linear',
  chartArea: 'solar:graph-up-linear',
  chartRadar: 'solar:graph-linear',
  chartCandle: 'solar:chart-square-linear',
  
  // Commerce & Business
  shopping: 'solar:cart-large-2-linear',
  shoppingBag: 'solar:bag-5-linear',
  creditCard: 'solar:card-linear',
  briefcase: 'solar:case-linear',
  
  // Communication
  mail: 'solar:letter-linear',
  message: 'solar:chat-round-linear',
  phone: 'solar:phone-linear',
  phoneOff: 'solar:phone-calling-rounded-linear',
  microphone: 'solar:microphone-linear',
  video: 'solar:videocamera-linear',
  camera: 'solar:camera-linear',
  volume: 'solar:volume-loud-linear',
  screenShare: 'solar:screen-share-linear',
  
  // Organization
  calendar: 'solar:calendar-linear',
  kanban: 'solar:widget-4-linear',
  note: 'solar:notes-linear',
  contacts: 'solar:book-bookmark-linear',
  
  // Content
  article: 'solar:document-text-linear',
  edit: 'solar:pen-linear',
  photo: 'solar:gallery-linear',
  file: 'solar:file-text-linear',
  
  // User & Auth
  user: 'solar:user-linear',
  users: 'solar:users-group-rounded-linear',
  userPlus: 'solar:user-plus-rounded-linear',
  lock: 'solar:lock-password-linear',
  key: 'solar:key-linear',
  logout: 'solar:logout-2-linear',
  
  // Actions
  settings: 'solar:settings-linear',
  help: 'solar:question-circle-linear',
  dotsVertical: 'solar:menu-dots-linear',
  moreHorizontal: 'solar:menu-dots-linear', // Will rotate in usage if needed, or find horizontal
  plus: 'solar:add-circle-linear',
  minus: 'solar:minus-circle-linear',
  check: 'solar:check-circle-linear',
  x: 'solar:close-circle-linear',
  arrowUp: 'solar:arrow-up-linear',
  arrowDown: 'solar:arrow-down-linear',
  arrowRight: 'solar:arrow-right-linear',
  arrowUpRight: 'solar:arrow-right-up-linear',
  arrowDownRight: 'solar:arrow-right-down-linear',
  maximize: 'solar:maximize-square-linear',
  minimize: 'solar:minimize-square-linear',
  
  // Table & Forms
  table: 'solar:list-linear',
  list: 'solar:list-linear',
  database: 'solar:database-linear',
  layoutGrid: 'solar:widget-3-linear',
  checklist: 'solar:checklist-minimalistic-linear',
  checkbox: 'solar:checkbox-square-linear',
  
  // Misc
  clock: 'solar:clock-circle-linear',
  bolt: 'solar:bolt-linear',
  palette: 'solar:palette-linear',
  sparkles: 'solar:star-linear',
  star: 'solar:star-linear',
  starFilled: 'solar:star-bold',
  quote: 'solar:quote-up-circle-linear',
  search: 'solar:magnifer-linear',
  trash: 'solar:trash-bin-minimalistic-linear',
  alertTriangle: 'solar:danger-triangle-linear',
  tag: 'solar:tag-linear',
  filter: 'solar:filter-linear',
  heart: 'solar:heart-linear',
  heartFilled: 'solar:heart-bold',
  eye: 'solar:eye-linear',
  circleCheck: 'solar:check-circle-linear',
  bell: 'solar:bell-linear',
  bookmark: 'solar:bookmark-linear',
  bookmarkFilled: 'solar:bookmark-bold',
  link: 'solar:link-linear',
  
  // Text Formatting
  textBold: 'solar:text-bold-linear',
  textItalic: 'solar:text-italic-linear',
  textUnderline: 'solar:text-underline-linear',
  textAlignLeft: 'solar:align-left-linear',
  textAlignCenter: 'solar:align-horizonta-center-linear',
  textAlignRight: 'solar:align-right-linear',
  heading: 'solar:text-linear',
  listNumbers: 'solar:list-down-linear',
  code: 'solar:code-linear',
  image: 'solar:gallery-add-linear',
  
  // Finance
  currencyDollar: 'solar:dollar-linear',
  wallet: 'solar:wallet-linear',
  
  // Analytics
  activity: 'solar:graph-new-linear',
  trendingUp: 'solar:graph-up-linear',

  // Brands / Social
  brandTwitter: 'solar:twitter-linear',
  brandFacebook: 'solar:facebook-linear',
  brandLinkedin: 'solar:linkedin-linear',
  
  // Storage
  deviceFloppy: 'solar:diskette-linear',
  
  // Brand (fallback to generic)
  typescript: 'solar:code-linear',
  
  // Additional UI
  deviceMobile: 'solar:smartphone-linear',
  deviceDesktop: 'solar:monitor-linear',
  deviceTablet: 'solar:tablet-linear',
  devices: 'solar:devices-linear',
  moon: 'solar:moon-linear',
  package: 'solar:box-linear',
  brandReact: 'solar:code-square-linear',
  rocket: 'solar:rocket-linear',
  refresh: 'solar:refresh-linear',
  download: 'solar:download-minimalistic-linear',
  externalLink: 'solar:arrow-right-up-linear',
  circleFilled: 'solar:record-circle-bold',
  brandChrome: 'solar:monitor-linear',
  brandFirefox: 'solar:monitor-linear',
  brandSafari: 'solar:monitor-linear',
  brandEdge: 'solar:monitor-linear',
  truck: 'solar:delivery-linear',
  upload: 'solar:upload-linear',
  send: 'solar:plain-linear',
  arrowLeft: 'solar:arrow-left-linear',
  share: 'solar:share-linear',
  shield: 'solar:shield-check-linear',
  paperclip: 'solar:paperclip-linear',
  infoCircle: 'solar:info-circle-linear',
  checks: 'solar:check-read-linear',
  mapPin: 'solar:map-point-linear',
  building: 'solar:buildings-2-linear',
  category: 'solar:widget-2-linear',
  archive: 'solar:archive-linear',
  pin: 'solar:pin-linear',
  pinnedOff: 'solar:pin-list-linear',
  calendarEvent: 'solar:calendar-mark-linear',
  dots: 'solar:menu-dots-linear',
  moodSmile: 'solar:emoji-funny-square-linear',
  
  // Email specific
  inbox: 'solar:inbox-line-linear',
  sent: 'solar:plain-2-linear',
  drafts: 'solar:document-text-linear',
  spam: 'solar:shield-warning-linear',

  // Complex Logic Features (Pro)
  ruleEngine: 'solar:tuning-2-linear',
  queryBuilder: 'solar:filter-linear',
  simulation: 'solar:pulse-2-linear',
  insights: 'solar:lightbulb-bolt-linear',
  workflowBuilder: 'solar:diagram-up-linear',
  taskScheduler: 'solar:calendar-date-linear',
} as const

// Helper function to create icon component
export function createIcon(iconName: keyof typeof Icons) {
  return function IconComponent({ 
    className, 
    width = 24, 
    height = 24,
    style 
  }: Omit<IconProps, 'icon'>) {
    return (
      <Icon 
        icon={Icons[iconName]} 
        className={className} 
        width={width} 
        height={height}
        style={style}
      />
    )
  }
}

// Type for icon component function
export type IconComponent = ReturnType<typeof createIcon>
