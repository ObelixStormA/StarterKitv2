import { useLocale } from '@/i18n'

const tableHeadClass =
  'text-left text-xs font-semibold uppercase tracking-wide text-secondary-500'

const cellClass = 'py-3 px-4 text-sm text-secondary-800'

type Row = {
  id: string
  name: string
  email: string
  role: string
  status: 'Active' | 'Invited' | 'Suspended'
}

const rows: Row[] = [
  { id: 'U-1001', name: 'Ava Johnson', email: 'ava@example.com', role: 'Admin', status: 'Active' },
  { id: 'U-1002', name: 'Noah Smith', email: 'noah@example.com', role: 'Manager', status: 'Active' },
  { id: 'U-1003', name: 'Mia Chen', email: 'mia@example.com', role: 'Editor', status: 'Invited' },
  { id: 'U-1004', name: 'Liam Brown', email: 'liam@example.com', role: 'Viewer', status: 'Suspended' },
  { id: 'U-1005', name: 'Sophia Davis', email: 'sophia@example.com', role: 'Editor', status: 'Active' },
]

function statusPill(status: Row['status']) {
  if (status === 'Active') {
    return 'bg-success-50 text-success-700 border-success-200'
  }
  if (status === 'Invited') {
    return 'bg-surface-50 text-secondary-700 border-surface-200'
  }
  return 'bg-danger-50 text-danger-700 border-danger-200'
}

function statusLabel(status: Row['status'], t: (key: string) => string) {
  if (status === 'Active') return t('tables.status.active')
  if (status === 'Invited') return t('tables.status.invited')
  return t('tables.status.suspended')
}

export function SimpleTablePage() {
  const { t } = useLocale()
  return (
    <div className="space-y-6">
      <div>
        <h1 className="heading-2 text-secondary-900">
          {t('tables.simple_table')}
        </h1>
        <p className="text-body-sm mt-1 text-secondary-500">
          {t('tables.simple_table_desc')}
        </p>
      </div>

      <div className="card rounded-xl p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-surface-50">
              <tr>
                <th className={`${tableHeadClass} py-3 px-4`}>{t('tables.column.id')}</th>
                <th className={`${tableHeadClass} py-3 px-4`}>{t('tables.column.name')}</th>
                <th className={`${tableHeadClass} py-3 px-4`}>{t('tables.column.email')}</th>
                <th className={`${tableHeadClass} py-3 px-4`}>{t('tables.column.role')}</th>
                <th className={`${tableHeadClass} py-3 px-4`}>{t('tables.column.status')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-200">
              {rows.map((r) => (
                <tr key={r.id} className="hover:bg-surface-50 transition-colors">
                  <td className={cellClass}>{r.id}</td>
                  <td className={cellClass}>
                    <div className="font-medium text-secondary-900">{r.name}</div>
                  </td>
                  <td className={cellClass}>{r.email}</td>
                  <td className={cellClass}>{r.role}</td>
                  <td className={cellClass}>
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${statusPill(r.status)}`}>
                      {statusLabel(r.status, t)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default SimpleTablePage
