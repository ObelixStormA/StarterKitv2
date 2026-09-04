# Skill: React/Inertia Sahifa Yaratish

## Trigger
"sahifa yarat", "react page", "tsx", "form", "inertia sahifa"

## Asosiy qoidalar

```tsx
// ISHLATMA — Axios/SPA
import axios from 'axios'
const res = await axios.get('/api/users')

// ISHLAT — Inertia
import { router, useForm, Link, usePage } from '@inertiajs/react'
router.get('/admin/users')
const form = useForm({ name: '' })
form.post('/admin/users')
```

## Minimal Index sahifasi

```tsx
import { Head, Link, router } from '@inertiajs/react'
import AdminLayout from '@/Layouts/AdminLayout'
import { Button } from '@/Components/ui/button'
import { usePermission } from '@/hooks/usePermission'
import type { PaginatedResponse, [Model] } from '@/types/models'

interface Props {
    items: PaginatedResponse<[Model]>
    filters: { search?: string }
}

export default function Index({ items, filters }: Props) {
    const { can } = usePermission()

    return (
        <AdminLayout>
            <Head title="[Modul nomi]" />
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">[Modul nomi]</h1>
                    {can('[table].create') && (
                        <Button asChild>
                            <Link href="/admin/[table]/create">Yangi</Link>
                        </Button>
                    )}
                </div>
                {/* jadval */}
            </div>
        </AdminLayout>
    )
}
```

## Minimal Create/Edit formasi

```tsx
import { Head, Link, useForm } from '@inertiajs/react'
import AdminLayout from '@/Layouts/AdminLayout'
import { Button } from '@/Components/ui/button'
import { Input } from '@/Components/ui/input'
import { Label } from '@/Components/ui/label'

export default function Create() {
    const form = useForm({ title: '', body: '' })

    function submit(e: React.FormEvent) {
        e.preventDefault()
        form.post('/admin/[table]')
        // Edit uchun: form.put(`/admin/[table]/${item.id}`)
    }

    return (
        <AdminLayout>
            <Head title="Yangi [model]" />
            <form onSubmit={submit} className="max-w-2xl space-y-4">
                <div className="space-y-1">
                    <Label htmlFor="title">Sarlavha</Label>
                    <Input
                        id="title"
                        value={form.data.title}
                        onChange={e => form.setData('title', e.target.value)}
                    />
                    {form.errors.title && (
                        <p className="text-sm text-destructive">{form.errors.title}</p>
                    )}
                </div>

                <div className="flex gap-3">
                    <Button type="submit" disabled={form.processing}>
                        {form.processing ? 'Saqlanmoqda...' : 'Saqlash'}
                    </Button>
                    <Button variant="outline" asChild>
                        <Link href="/admin/[table]">Bekor</Link>
                    </Button>
                </div>
            </form>
        </AdminLayout>
    )
}
```

## Checklist
- [ ] `AdminLayout` wrap qilgan
- [ ] `Head title` qo'yilgan
- [ ] Props TypeScript interfeys aniqlangan
- [ ] `useForm` — `@inertiajs/react` dan
- [ ] `form.processing` ko'rsatilgan
- [ ] `form.errors.field` har maydon uchun
- [ ] `can()` bilan permission tekshirilgan
- [ ] `any` TypeScript da yo'q
