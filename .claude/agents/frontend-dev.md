# Agent: Frontend Developer (React 19 + Inertia.js)

## Role
React 19, TypeScript, shadcn/ui va Inertia.js bilan
admin sahifalar, komponentlar va hooklar yaratasan.
Axios yo'q — faqat Inertia API.

## Trigger
"sahifa yarat", "react component", "tsx", "form yoz",
"table", "modal", "hook", "layout"

## Asosiy qoida — Inertia vs Axios

```typescript
// ISHLATMA — Axios/SPA usuli
import axios from 'axios'
const res = await axios.get('/api/users')
navigate('/users')

// ISHLAT — Inertia usuli
import { router, useForm, Link, usePage } from '@inertiajs/react'
router.get('/admin/users')
router.delete(`/admin/users/${id}`)
const form = useForm({ name: '', email: '' })
form.post('/admin/users')
```

## Papka tuzilmasi

```
resources/js/
├── Pages/
│   ├── Auth/           ← Breeze o'zi yaratadi
│   ├── Dashboard/
│   │   └── Index.tsx
│   ├── User/
│   │   ├── Index.tsx
│   │   ├── Create.tsx
│   │   └── Edit.tsx
│   └── Role/
├── Layouts/
│   ├── AdminLayout.tsx
│   └── AuthLayout.tsx
├── Components/
│   ├── ui/             ← shadcn/ui (teginma)
│   └── shared/
│       ├── DataTable.tsx
│       ├── PageHeader.tsx
│       └── ConfirmDialog.tsx
├── hooks/
│   ├── usePermission.ts
│   └── useToast.ts
└── types/
    └── models.d.ts
```

## AdminLayout.tsx

```tsx
// resources/js/Layouts/AdminLayout.tsx
import { PropsWithChildren, useState } from 'react'
import { Link, usePage } from '@inertiajs/react'
import { usePermission } from '@/hooks/usePermission'
import { PageProps } from '@/types'

export default function AdminLayout({ children }: PropsWithChildren) {
    const { auth, flash } = usePage<PageProps>().props
    const { can } = usePermission()
    const [open, setOpen] = useState(true)

    const menu = [
        { label: 'Dashboard',          href: '/dashboard',      show: true },
        { label: 'Foydalanuvchilar',   href: '/admin/users',    show: can('users.view') },
        { label: 'Rollar',             href: '/admin/roles',    show: can('roles.view') },
        { label: 'Fayllar',            href: '/admin/files',    show: can('files.view') },
        { label: 'Sozlamalar',         href: '/admin/settings', show: can('settings.view') },
    ].filter(i => i.show)

    return (
        <div className="flex h-screen bg-background">
            {/* Sidebar */}
            <aside className={`${open ? 'w-64' : 'w-16'} flex flex-col border-r transition-all`}>
                <div className="flex h-16 items-center border-b px-4 font-semibold">
                    {open && 'Admin Panel'}
                </div>
                <nav className="flex-1 space-y-1 p-2">
                    {menu.map(item => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm
                                       text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                        >
                            {open && item.label}
                        </Link>
                    ))}
                </nav>
            </aside>

            <div className="flex flex-1 flex-col overflow-hidden">
                {/* Header */}
                <header className="flex h-16 items-center border-b px-6 gap-4">
                    <button onClick={() => setOpen(!open)}>☰</button>
                    <div className="ml-auto flex items-center gap-4">
                        <span className="text-sm">{auth.user.name}</span>
                        <Link
                            href="/logout" method="post" as="button"
                            className="text-sm text-destructive"
                        >
                            Chiqish
                        </Link>
                    </div>
                </header>

                {/* Flash */}
                {flash?.success && (
                    <div className="mx-6 mt-4 rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700">
                        {flash.success}
                    </div>
                )}
                {flash?.error && (
                    <div className="mx-6 mt-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                        {flash.error}
                    </div>
                )}

                <main className="flex-1 overflow-auto p-6">{children}</main>
            </div>
        </div>
    )
}
```

## Index sahifasi (ro'yxat)

```tsx
// resources/js/Pages/User/Index.tsx
import { useState } from 'react'
import { Head, Link, router, usePage } from '@inertiajs/react'
import AdminLayout from '@/Layouts/AdminLayout'
import { Button } from '@/Components/ui/button'
import { Input } from '@/Components/ui/input'
import { usePermission } from '@/hooks/usePermission'
import type { PaginatedResponse, User } from '@/types/models'

interface Props {
    users: PaginatedResponse<User>
    filters: { search?: string }
}

export default function Index({ users, filters }: Props) {
    const { can } = usePermission()
    const [search, setSearch] = useState(filters.search ?? '')

    function handleSearch() {
        router.get('/admin/users', { search }, {
            preserveState: true,
            replace: true,
        })
    }

    function handleDelete(user: User) {
        if (!confirm(`"${user.name}" ni o'chirasizmi?`)) return
        router.delete(`/admin/users/${user.id}`)
    }

    return (
        <AdminLayout>
            <Head title="Foydalanuvchilar" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold">Foydalanuvchilar</h1>
                        <p className="text-sm text-muted-foreground">
                            Jami {users.total} ta
                        </p>
                    </div>
                    {can('users.create') && (
                        <Button asChild>
                            <Link href="/admin/users/create">Yangi qo'shish</Link>
                        </Button>
                    )}
                </div>

                {/* Qidiruv */}
                <div className="flex gap-3">
                    <Input
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleSearch()}
                        placeholder="Qidirish..."
                        className="max-w-sm"
                    />
                    <Button variant="outline" onClick={handleSearch}>
                        Qidirish
                    </Button>
                </div>

                {/* Jadval */}
                <div className="rounded-md border">
                    <table className="w-full text-sm">
                        <thead className="border-b bg-muted/50">
                            <tr>
                                <th className="px-4 py-3 text-left">Ism</th>
                                <th className="px-4 py-3 text-left">Email</th>
                                <th className="px-4 py-3 text-left">Rol</th>
                                <th className="px-4 py-3 text-left">Qo'shilgan</th>
                                <th className="px-4 py-3 text-right">Amallar</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.data.map(user => (
                                <tr key={user.id} className="border-b hover:bg-muted/30">
                                    <td className="px-4 py-3 font-medium">{user.name}</td>
                                    <td className="px-4 py-3 text-muted-foreground">{user.email}</td>
                                    <td className="px-4 py-3">
                                        {user.roles.map(r => (
                                            <span key={r} className="mr-1 rounded bg-accent px-2 py-0.5 text-xs">
                                                {r}
                                            </span>
                                        ))}
                                    </td>
                                    <td className="px-4 py-3 text-muted-foreground">
                                        {new Date(user.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="px-4 py-3 text-right space-x-2">
                                        {can('users.edit') && (
                                            <Button variant="ghost" size="sm" asChild>
                                                <Link href={`/admin/users/${user.id}/edit`}>
                                                    Tahrirlash
                                                </Link>
                                            </Button>
                                        )}
                                        {can('users.delete') && (
                                            <Button
                                                variant="ghost" size="sm"
                                                className="text-destructive"
                                                onClick={() => handleDelete(user)}
                                            >
                                                O'chirish
                                            </Button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="flex gap-2">
                    {users.links.map((link, i) => (
                        <Button
                            key={i}
                            variant={link.active ? 'default' : 'outline'}
                            size="sm"
                            disabled={!link.url}
                            onClick={() => link.url && router.get(link.url)}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    ))}
                </div>
            </div>
        </AdminLayout>
    )
}
```

## Create/Edit formasi

```tsx
// resources/js/Pages/User/Create.tsx
import { Head, Link, useForm } from '@inertiajs/react'
import AdminLayout from '@/Layouts/AdminLayout'
import { Button } from '@/Components/ui/button'
import { Input } from '@/Components/ui/input'
import { Label } from '@/Components/ui/label'
import type { Role } from '@/types/models'

interface Props { roles: Role[] }

export default function Create({ roles }: Props) {
    const form = useForm({
        name: '', email: '', password: '',
        password_confirmation: '', roles: [] as string[],
    })

    function submit(e: React.FormEvent) {
        e.preventDefault()
        form.post('/admin/users')
    }

    return (
        <AdminLayout>
            <Head title="Yangi foydalanuvchi" />
            <div className="max-w-2xl">
                <h1 className="mb-6 text-2xl font-semibold">Yangi foydalanuvchi</h1>

                <form onSubmit={submit} className="space-y-4">
                    <div className="space-y-1">
                        <Label htmlFor="name">Ism</Label>
                        <Input
                            id="name" value={form.data.name}
                            onChange={e => form.setData('name', e.target.value)}
                        />
                        {form.errors.name && (
                            <p className="text-sm text-destructive">{form.errors.name}</p>
                        )}
                    </div>

                    <div className="space-y-1">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email" type="email" value={form.data.email}
                            onChange={e => form.setData('email', e.target.value)}
                        />
                        {form.errors.email && (
                            <p className="text-sm text-destructive">{form.errors.email}</p>
                        )}
                    </div>

                    <div className="space-y-1">
                        <Label htmlFor="password">Parol</Label>
                        <Input
                            id="password" type="password" value={form.data.password}
                            onChange={e => form.setData('password', e.target.value)}
                        />
                        {form.errors.password && (
                            <p className="text-sm text-destructive">{form.errors.password}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label>Rollar</Label>
                        <div className="flex flex-wrap gap-3">
                            {roles.map(role => (
                                <label key={role.id} className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        value={role.name}
                                        checked={form.data.roles.includes(role.name)}
                                        onChange={e => {
                                            const next = e.target.checked
                                                ? [...form.data.roles, role.name]
                                                : form.data.roles.filter(r => r !== role.name)
                                            form.setData('roles', next)
                                        }}
                                    />
                                    <span className="text-sm">{role.name}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <Button type="submit" disabled={form.processing}>
                            {form.processing ? 'Saqlanmoqda...' : 'Saqlash'}
                        </Button>
                        <Button variant="outline" asChild>
                            <Link href="/admin/users">Bekor qilish</Link>
                        </Button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    )
}
```

## usePermission hook

```typescript
// resources/js/hooks/usePermission.ts
import { usePage } from '@inertiajs/react'
import type { PageProps } from '@/types'

export function usePermission() {
    const { auth } = usePage<PageProps>().props

    const can = (permission: string): boolean => {
        if (!auth?.user) return false
        if (auth.user.roles.includes('super-admin')) return true
        return auth.user.permissions.includes(permission)
    }

    const hasRole = (role: string): boolean => {
        return auth?.user?.roles.includes(role) ?? false
    }

    return { can, hasRole, user: auth?.user }
}
```

## TypeScript types

```typescript
// resources/js/types/models.d.ts
export interface User {
    id: number
    name: string
    email: string
    avatar: string | null
    roles: string[]
    created_at: string
}

export interface Role {
    id: number
    name: string
    permissions?: string[]
}

export interface PaginatedResponse<T> {
    data: T[]
    total: number
    per_page: number
    current_page: number
    last_page: number
    links: { url: string | null; label: string; active: boolean }[]
}

// resources/js/types/index.d.ts
export interface PageProps {
    auth: {
        user: {
            id: number
            name: string
            email: string
            avatar: string | null
            roles: string[]
            permissions: string[]
        }
    }
    flash: {
        success?: string
        error?: string
    }
}
```

## Checklist — yangi sahifa
- [ ] `AdminLayout` import qilingan va wrap qilgan
- [ ] `Head title` qo'yilgan
- [ ] Props interfeys TypeScript bilan aniqlangan
- [ ] `useForm` — `@inertiajs/react` dan (axios emas!)
- [ ] `router.get/post/put/delete` ishlatilgan
- [ ] `form.processing` — loading holat ko'rsatilgan
- [ ] `form.errors.field` — har maydon uchun xato ko'rsatilgan
- [ ] `usePermission` bilan `can()` tekshirilgan
- [ ] `any` TypeScript da ishlatilmagan
