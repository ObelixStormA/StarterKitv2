import { useMemo, useState } from 'react'
import { Icon, Icons } from '@/components/common'
import { useLocale } from '@/i18n'

type Status = 'Active' | 'Invited' | 'Suspended'

type Row = {
  id: string
  name: string
  email: string
  team: string
  createdAt: string
  status: Status
}

const inputClassName =
  'w-full pl-10 pr-4 py-2.5 bg-surface-50 border border-surface-200 rounded-xl text-sm text-secondary-900 placeholder-secondary-400 focus:outline-none focus:ring-2 focus:ring-theme-primary/20 focus:border-theme-primary transition-all'

const selectClassName =
  'w-full px-4 py-2.5 bg-surface-50 border border-surface-200 rounded-xl text-sm text-secondary-900 focus:outline-none focus:ring-2 focus:ring-theme-primary/20 focus:border-theme-primary transition-all'

const tableHeadClass =
  'text-left text-xs font-semibold uppercase tracking-wide text-secondary-500'

const cellClass = 'py-3 px-4 text-sm text-secondary-800'

const allRows: Row[] = [
  { id: 'U-1001', name: 'Ava Johnson', email: 'ava@example.com', team: 'Operations', createdAt: '2025-11-12', status: 'Active' },
  { id: 'U-1002', name: 'Noah Smith', email: 'noah@example.com', team: 'Sales', createdAt: '2025-10-03', status: 'Active' },
  { id: 'U-1003', name: 'Mia Chen', email: 'mia@example.com', team: 'Marketing', createdAt: '2025-12-01', status: 'Invited' },
  { id: 'U-1004', name: 'Liam Brown', email: 'liam@example.com', team: 'Support', createdAt: '2025-08-20', status: 'Suspended' },
  { id: 'U-1005', name: 'Sophia Davis', email: 'sophia@example.com', team: 'Engineering', createdAt: '2025-09-14', status: 'Active' },
  { id: 'U-1006', name: 'Ethan Wilson', email: 'ethan@example.com', team: 'Engineering', createdAt: '2025-11-26', status: 'Active' },
  { id: 'U-1007', name: 'Isabella Martinez', email: 'isabella@example.com', team: 'Marketing', createdAt: '2025-07-18', status: 'Invited' },
  { id: 'U-1008', name: 'James Taylor', email: 'james@example.com', team: 'Operations', createdAt: '2025-06-02', status: 'Active' },
  { id: 'U-1009', name: 'Olivia Anderson', email: 'olivia@example.com', team: 'Support', createdAt: '2025-05-09', status: 'Suspended' },
  { id: 'U-1010', name: 'Benjamin Thomas', email: 'benjamin@example.com', team: 'Sales', createdAt: '2025-04-22', status: 'Active' },
  { id: 'U-1011', name: 'Charlotte Moore', email: 'charlotte@example.com', team: 'Operations', createdAt: '2025-03-15', status: 'Active' },
  { id: 'U-1012', name: 'Daniel Jackson', email: 'daniel@example.com', team: 'Engineering', createdAt: '2025-02-08', status: 'Invited' },
]

type SortKey = 'name' | 'email' | 'team' | 'createdAt'

type SortState = {
  key: SortKey
  direction: 'asc' | 'desc'
}

function statusPill(status: Status) {
  if (status === 'Active') {
    return 'bg-success-50 text-success-700 border-success-200'
  }
  if (status === 'Invited') {
    return 'bg-surface-50 text-secondary-700 border-surface-200'
  }
  return 'bg-danger-50 text-danger-700 border-danger-200'
}

function compare(a: string, b: string) {
  return a.localeCompare(b, undefined, { sensitivity: 'base' })
}

export function DataTablePage() {
  const { t } = useLocale()
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState<'All' | Status>('All')
  const [sort, setSort] = useState<SortState>({ key: 'name', direction: 'asc' })
  const [page, setPage] = useState(1)
  const pageSize = 6

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return allRows.filter((r) => {
      const matchesStatus = status === 'All' || r.status === status
      const matchesQuery =
        q.length === 0 ||
        r.name.toLowerCase().includes(q) ||
        r.email.toLowerCase().includes(q) ||
        r.team.toLowerCase().includes(q) ||
        r.id.toLowerCase().includes(q)
      return matchesStatus && matchesQuery
    })
  }, [query, status])

  const sorted = useMemo(() => {
    const copy = [...filtered]
    copy.sort((a, b) => {
      const dir = sort.direction === 'asc' ? 1 : -1
      if (sort.key === 'createdAt') return dir * compare(a.createdAt, b.createdAt)
      return dir * compare(a[sort.key], b[sort.key])
    })
    return copy
  }, [filtered, sort])

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize))

  const pageRows = useMemo(() => {
    const safePage = Math.min(Math.max(1, page), totalPages)
    const start = (safePage - 1) * pageSize
    return sorted.slice(start, start + pageSize)
  }, [page, sorted, totalPages])

  const toggleSort = (key: SortKey) => {
    setPage(1)
    setSort((prev) => {
      if (prev.key !== key) return { key, direction: 'asc' }
      return { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' }
    })
  }

  const sortLabel = (key: SortKey) => {
    if (sort.key !== key) return ''
    return sort.direction === 'asc' ? ` (${t('tables.sort_az')})` : ` (${t('tables.sort_za')})`
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="heading-2 text-secondary-900">
          {t('tables.data_table')}
        </h1>
        <p className="text-body-sm mt-1 text-secondary-500">
          {t('tables.data_table_desc')}
        </p>
      </div>

      <div className="card rounded-xl p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 relative">
            <Icon icon={Icons.search} className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary-400" />
            <input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value)
                setPage(1)
              }}
              className={inputClassName}
              placeholder={t('tables.search_placeholder')}
            />
          </div>

          <div>
            <select
              value={status}
              onChange={(e) => {
                setStatus(e.target.value as 'All' | Status)
                setPage(1)
              }}
              className={selectClassName}
            >
              <option value="All">{t('tables.status.all')}</option>
              <option value="Active">{t('tables.status.active')}</option>
              <option value="Invited">{t('tables.status.invited')}</option>
              <option value="Suspended">{t('tables.status.suspended')}</option>
            </select>
          </div>
        </div>

        <div className="mt-5 rounded-xl overflow-hidden border border-surface-200">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-surface-50">
                <tr>
                  <th className={`${tableHeadClass} py-3 px-4`}>{t('tables.column.id')}</th>
                  <th className={`${tableHeadClass} py-3 px-4`}>
                    <button
                      type="button"
                      onClick={() => toggleSort('name')}
                      className="inline-flex items-center gap-1 hover:text-secondary-700"
                    >
                      {t('tables.column.name')}
                      <Icon
                        icon={Icons.chevronDown}
                        className={`w-4 h-4 transition-transform ${sort.key === 'name' && sort.direction === 'desc' ? 'rotate-180' : ''}`}
                      />
                      <span className="sr-only">{t('tables.sort_by', { column: t('tables.column.name') })}{sortLabel('name')}</span>
                    </button>
                  </th>
                  <th className={`${tableHeadClass} py-3 px-4`}>
                    <button
                      type="button"
                      onClick={() => toggleSort('email')}
                      className="inline-flex items-center gap-1 hover:text-secondary-700"
                    >
                      {t('tables.column.email')}
                      <Icon
                        icon={Icons.chevronDown}
                        className={`w-4 h-4 transition-transform ${sort.key === 'email' && sort.direction === 'desc' ? 'rotate-180' : ''}`}
                      />
                      <span className="sr-only">{t('tables.sort_by', { column: t('tables.column.email') })}{sortLabel('email')}</span>
                    </button>
                  </th>
                  <th className={`${tableHeadClass} py-3 px-4`}>
                    <button
                      type="button"
                      onClick={() => toggleSort('team')}
                      className="inline-flex items-center gap-1 hover:text-secondary-700"
                    >
                      {t('tables.column.team')}
                      <Icon
                        icon={Icons.chevronDown}
                        className={`w-4 h-4 transition-transform ${sort.key === 'team' && sort.direction === 'desc' ? 'rotate-180' : ''}`}
                      />
                      <span className="sr-only">{t('tables.sort_by', { column: t('tables.column.team') })}{sortLabel('team')}</span>
                    </button>
                  </th>
                  <th className={`${tableHeadClass} py-3 px-4`}>
                    <button
                      type="button"
                      onClick={() => toggleSort('createdAt')}
                      className="inline-flex items-center gap-1 hover:text-secondary-700"
                    >
                      {t('tables.column.created')}
                      <Icon
                        icon={Icons.chevronDown}
                        className={`w-4 h-4 transition-transform ${sort.key === 'createdAt' && sort.direction === 'desc' ? 'rotate-180' : ''}`}
                      />
                      <span className="sr-only">{t('tables.sort_by', { column: t('tables.column.created') })}{sortLabel('createdAt')}</span>
                    </button>
                  </th>
                  <th className={`${tableHeadClass} py-3 px-4`}>{t('tables.column.status')}</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-surface-200">
                {pageRows.map((r) => (
                  <tr key={r.id} className="hover:bg-surface-50 transition-colors">
                    <td className={cellClass}>{r.id}</td>
                    <td className={cellClass}>
                      <div className="font-medium text-secondary-900">{r.name}</div>
                    </td>
                    <td className={cellClass}>{r.email}</td>
                    <td className={cellClass}>{r.team}</td>
                    <td className={cellClass}>{r.createdAt}</td>
                    <td className={cellClass}>
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${statusPill(r.status)}`}>
                        {r.status === 'Active'
                          ? t('tables.status.active')
                          : r.status === 'Invited'
                            ? t('tables.status.invited')
                            : t('tables.status.suspended')}
                      </span>
                    </td>
                  </tr>
                ))}

                {pageRows.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-10 px-4 text-center text-sm text-secondary-500">
                      {t('tables.no_results')}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-5 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <p className="text-sm text-secondary-500">
            {t('tables.showing_results', { shown: pageRows.length, total: sorted.length })}
          </p>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="px-3 py-2 rounded-lg border border-surface-200 text-sm text-secondary-700 hover:bg-surface-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {t('tables.prev')}
            </button>
            <div className="px-3 py-2 text-sm text-secondary-700">
              {t('tables.page_of', { page: Math.min(page, totalPages), totalPages })}
            </div>
            <button
              type="button"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="px-3 py-2 rounded-lg border border-surface-200 text-sm text-secondary-700 hover:bg-surface-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {t('tables.next')}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DataTablePage
