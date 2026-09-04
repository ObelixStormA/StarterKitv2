import { useState } from 'react'
import { Icon, Icons } from '@/components/common'
import { useLocale } from '@/i18n'

type Tab = 'account' | 'notifications' | 'billing' | 'security' | 'devices'

export default function AccountSettingsPage() {
  const { t } = useLocale()
  const [activeTab, setActiveTab] = useState<Tab>('account')

  const tabs = [
    { id: 'account' as Tab, label: t('account.tab.account'), icon: Icons.user },
    { id: 'notifications' as Tab, label: t('account.tab.notifications'), icon: Icons.bell },
    { id: 'billing' as Tab, label: t('account.tab.billing'), icon: Icons.creditCard },
    { id: 'security' as Tab, label: t('account.tab.security'), icon: Icons.shield },
    { id: 'devices' as Tab, label: t('account.tab.devices'), icon: Icons.devices },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="heading-2 text-secondary-900">{t('account.title')}</h1>
        <p className="text-body-sm mt-1 text-secondary-500">
          {t('account.description')}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Tabs Sidebar */}
        <div className="lg:col-span-1">
          <div className="card rounded-xl p-2 space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                  activeTab === tab.id
                    ? 'bg-theme-primary text-white'
                    : 'text-secondary-700 hover:bg-surface-100'
                }`}
              >
                <Icon icon={tab.icon} width={20} height={20} />
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3">
          <div className="card rounded-xl p-6">
            {activeTab === 'account' && <AccountTab />}
            {activeTab === 'notifications' && <NotificationsTab />}
            {activeTab === 'billing' && <BillingTab />}
            {activeTab === 'security' && <SecurityTab />}
            {activeTab === 'devices' && <DevicesTab />}
          </div>
        </div>
      </div>
    </div>
  )
}

function AccountTab() {
  const { t } = useLocale()
  return (
    <div className="space-y-6">
      <div>
        <h2 className="heading-4 text-secondary-900 mb-1">
          {t('account.personal_info')}
        </h2>
        <p className="text-sm text-secondary-500">
          {t('account.personal_info_desc')}
        </p>
      </div>

      {/* Profile Photo */}
      <div>
        <label className="block text-sm font-medium text-secondary-700 mb-2">
          {t('account.profile_photo')}
        </label>
        <div className="flex items-center gap-4">
          <img
            src="https://i.pravatar.cc/150?img=1"
            alt="Profile"
            className="w-20 h-20 rounded-full"
          />
          <button className="px-4 py-2 bg-theme-primary hover:bg-theme-primary-dark text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
            <Icon icon={Icons.upload} width={16} height={16} />
            {t('account.upload_new_photo')}
          </button>
        </div>
      </div>

      {/* Form Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-1.5">
            {t('account.first_name')}
          </label>
          <input
            type="text"
            defaultValue="John"
            className="w-full px-4 py-2.5 bg-surface-50 border border-surface-200 rounded-xl text-sm text-secondary-900 focus:outline-none focus:ring-2 focus:ring-theme-primary/20 focus:border-theme-primary transition-all"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-1.5">
            {t('account.last_name')}
          </label>
          <input
            type="text"
            defaultValue="Doe"
            className="w-full px-4 py-2.5 bg-surface-50 border border-surface-200 rounded-xl text-sm text-secondary-900 focus:outline-none focus:ring-2 focus:ring-theme-primary/20 focus:border-theme-primary transition-all"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-secondary-700 mb-1.5">
            {t('account.email_address')}
          </label>
          <input
            type="email"
            defaultValue="john.doe@example.com"
            className="w-full px-4 py-2.5 bg-surface-50 border border-surface-200 rounded-xl text-sm text-secondary-900 focus:outline-none focus:ring-2 focus:ring-theme-primary/20 focus:border-theme-primary transition-all"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-secondary-700 mb-1.5">
            {t('account.bio')}
          </label>
          <textarea
            rows={3}
            defaultValue="Software developer and tech enthusiast"
            className="w-full px-4 py-2.5 bg-surface-50 border border-surface-200 rounded-xl text-sm text-secondary-900 focus:outline-none focus:ring-2 focus:ring-theme-primary/20 focus:border-theme-primary transition-all resize-none"
          />
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-surface-200">
        <button className="px-4 py-2 bg-surface-100 hover:bg-surface-200 text-secondary-700 rounded-lg font-medium transition-colors">
          {t('account.cancel')}
        </button>
        <button className="px-4 py-2 bg-theme-primary hover:bg-theme-primary-dark text-white rounded-lg font-medium transition-colors">
          {t('account.save_changes')}
        </button>
      </div>
    </div>
  )
}

function NotificationsTab() {
  const { t } = useLocale()
  const settings = [
    { id: 'email', label: t('account.email_notifications'), description: t('account.email_notifications_desc') },
    { id: 'push', label: t('account.push_notifications'), description: t('account.push_notifications_desc') },
    { id: 'sms', label: t('account.sms_notifications'), description: t('account.sms_notifications_desc') },
    { id: 'marketing', label: t('account.marketing_emails'), description: t('account.marketing_emails_desc') },
    { id: 'mentions', label: t('account.mentions_comments'), description: t('account.mentions_comments_desc') },
    { id: 'updates', label: t('account.product_updates'), description: t('account.product_updates_desc') },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="heading-4 text-secondary-900 mb-1">
          {t('account.notification_preferences')}
        </h2>
        <p className="text-sm text-secondary-500">
          {t('account.notification_desc')}
        </p>
      </div>

      <div className="space-y-4">
        {settings.map((setting) => (
          <div key={setting.id} className="flex items-start justify-between py-3 border-b border-surface-200 last:border-0">
            <div className="flex-1">
              <h5 className="font-medium text-secondary-900 mb-0.5">
                {setting.label}
              </h5>
              <p className="text-sm text-secondary-600">
                {setting.description}
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer ml-4">
              <input type="checkbox" defaultChecked className="sr-only peer" />
              <div className="w-11 h-6 bg-surface-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-theme-primary"></div>
            </label>
          </div>
        ))}
      </div>
    </div>
  )
}

function BillingTab() {
  const { t } = useLocale()
  return (
    <div className="space-y-6">
      <div>
        <h2 className="heading-4 text-secondary-900 mb-1">
          {t('account.billing_subscription')}
        </h2>
        <p className="text-sm text-secondary-500">
          {t('account.billing_desc')}
        </p>
      </div>

      {/* Current Plan */}
      <div className="p-6 bg-gradient-to-r from-theme-primary/10 to-theme-primary/5 border border-theme-primary/20 rounded-xl">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="heading-4 text-secondary-900 mb-1">
              {t('account.free_plan')}
            </h3>
            <p className="text-sm text-secondary-500">
              {t('account.free_plan_desc')}
            </p>
          </div>
          <div className="text-right">
            <div className="heading-3 text-secondary-900">$0</div>
            <div className="text-sm text-secondary-500">{t('account.per_month')}</div>
          </div>
        </div>
      </div>

      {/* Payment Method */}
      <div>
        <h3 className="font-semibold text-secondary-900 mb-3">{t('account.payment_method')}</h3>
        <div className="p-4 border border-surface-200 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Icon icon={Icons.creditCard} width={24} height={24} className="text-secondary-600" />
            <div>
              <div className="font-medium text-secondary-900">
                •••• •••• •••• 4242
              </div>
              <div className="text-sm text-secondary-600">
                {t('account.expires')}
              </div>
            </div>
          </div>
          <button className="text-sm text-theme-primary hover:text-theme-primary-dark font-medium">
            {t('account.edit')}
          </button>
        </div>
      </div>

      {/* Billing History */}
      <div>
        <h3 className="font-semibold text-secondary-900 mb-3">{t('account.billing_history')}</h3>
        <div className="border border-surface-200 rounded-xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-surface-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-secondary-500">
                  {t('account.date')}
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-secondary-500">
                  {t('account.description_col')}
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-secondary-500">
                  {t('account.amount')}
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-secondary-500">
                  {t('account.status_col')}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-200">
              <tr>
                <td className="px-4 py-3 text-sm text-secondary-900">Dec 14, 2025</td>
                <td className="px-4 py-3 text-sm text-secondary-600">
                  {t('account.free_plan')}
                </td>
                <td className="px-4 py-3 text-sm text-secondary-900 text-right">
                  $0.00
                </td>
                <td className="px-4 py-3 text-right">
                  <span className="px-2 py-1 bg-success-100 text-success-700 text-xs rounded-full">
                    {t('account.active')}
                  </span>
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-sm text-secondary-900">Nov 14, 2025</td>
                <td className="px-4 py-3 text-sm text-secondary-600">
                  {t('account.free_plan')}
                </td>
                <td className="px-4 py-3 text-sm text-secondary-900 text-right">
                  $0.00
                </td>
                <td className="px-4 py-3 text-right">
                  <span className="px-2 py-1 bg-success-100 text-success-700 text-xs rounded-full">
                    {t('account.paid')}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function SecurityTab() {
  const { t } = useLocale()
  return (
    <div className="space-y-6">
      <div>
        <h2 className="heading-4 text-secondary-900 mb-1">
          {t('account.security_settings')}
        </h2>
        <p className="text-sm text-secondary-500">
          {t('account.security_desc')}
        </p>
      </div>

      {/* Change Password */}
      <div>
        <h3 className="font-semibold text-secondary-900 mb-3 flex items-center gap-2">
          <Icon icon={Icons.key} width={20} height={20} />
          {t('account.change_password')}
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-1.5">
              {t('account.current_password')}
            </label>
            <input
              type="password"
              className="w-full px-4 py-2.5 bg-surface-50 border border-surface-200 rounded-xl text-sm text-secondary-900 focus:outline-none focus:ring-2 focus:ring-theme-primary/20 focus:border-theme-primary transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-1.5">
              {t('account.new_password')}
            </label>
            <input
              type="password"
              className="w-full px-4 py-2.5 bg-surface-50 border border-surface-200 rounded-xl text-sm text-secondary-900 focus:outline-none focus:ring-2 focus:ring-theme-primary/20 focus:border-theme-primary transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-1.5">
              {t('account.confirm_new_password')}
            </label>
            <input
              type="password"
              className="w-full px-4 py-2.5 bg-surface-50 border border-surface-200 rounded-xl text-sm text-secondary-900 focus:outline-none focus:ring-2 focus:ring-theme-primary/20 focus:border-theme-primary transition-all"
            />
          </div>
          <button className="px-4 py-2 bg-theme-primary hover:bg-theme-primary-dark text-white rounded-lg font-medium transition-colors">
            {t('account.update_password')}
          </button>
        </div>
      </div>

      {/* Two-Factor Authentication */}
      <div className="pt-6 border-t border-surface-200">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-semibold text-secondary-900 mb-1 flex items-center gap-2">
              <Icon icon={Icons.shield} width={20} height={20} />
              {t('account.two_factor_auth')}
            </h3>
            <p className="text-sm text-secondary-500">
              {t('account.two_factor_desc')}
            </p>
          </div>
          <button className="px-4 py-2 bg-surface-100 hover:bg-surface-200 text-secondary-700 rounded-lg font-medium transition-colors">
            {t('account.enable')}
          </button>
        </div>
      </div>

      {/* Active Sessions */}
      <div className="pt-6 border-t border-surface-200">
        <h3 className="font-semibold text-secondary-900 mb-3">{t('account.active_sessions')}</h3>
        <div className="space-y-3">
          <div className="p-4 border border-surface-200 rounded-xl flex items-center justify-between">
            <div>
              <div className="font-medium text-secondary-900 flex items-center gap-2">
                <Icon icon={Icons.check} width={16} height={16} className="text-success-600" />
                {t('account.current_session')}
              </div>
              <div className="text-sm text-secondary-600 mt-1">
                Chrome on MacOS • {t('account.last_active_now')}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function DevicesTab() {
  const { t } = useLocale()
  const devices = [
    { name: 'MacBook Pro', type: 'Desktop', location: 'New York, USA', lastActive: '2 min ago', current: true },
    { name: 'iPhone 14', type: 'Mobile', location: 'New York, USA', lastActive: '1 hour ago', current: false },
    { name: 'iPad Air', type: 'Tablet', location: 'Los Angeles, USA', lastActive: '2 days ago', current: false },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="heading-4 text-secondary-900 mb-1">
          {t('account.connected_devices')}
        </h2>
        <p className="text-sm text-secondary-500">
          {t('account.devices_desc')}
        </p>
      </div>

      <div className="space-y-3">
        {devices.map((device, index) => (
          <div
            key={index}
            className="p-4 border border-surface-200 rounded-xl flex items-center justify-between"
          >
            <div className="flex items-start gap-3">
              <div className="p-2 bg-surface-100 rounded-lg">
                <Icon icon={Icons.devices} width={20} height={20} className="text-secondary-600" />
              </div>
              <div>
                <div className="font-medium text-secondary-900 flex items-center gap-2">
                  {device.name}
                  {device.current && (
                    <span className="px-2 py-0.5 bg-success-100 text-success-700 text-xs rounded-full">
                      {t('account.current')}
                    </span>
                  )}
                </div>
                <div className="text-sm text-secondary-600 mt-1">
                  {device.type} • {device.location}
                </div>
                <div className="text-xs text-secondary-500 mt-0.5">
                  {t('account.last_active', { time: device.lastActive })}
                </div>
              </div>
            </div>
            {!device.current && (
              <button className="text-sm text-danger-600 hover:text-danger-700 font-medium">
                {t('account.remove')}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
