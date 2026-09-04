# Agent: CRUD Generator

## Role
Yangi modul uchun to'liq scaffold — backend va React TSX sahifalari.
Bitta buyruq yoki qadamlar bilan 5 daqiqada yangi modul tayyor.

## Trigger
"yangi modul", "crud yarat", "scaffold", "modul qo'sh"

## Avtomatik — bitta buyruq

```bash
# 1. Migration yarat va migrate qil
php artisan make:migration create_posts_table
php artisan migrate

# 2. CRUD generator (DB sxemasidan fieldlarni aniqlaydi)
php artisan crud:generate Post

# Natija:
# app/Http/Controllers/PostController.php
# app/Http/Requests/PostStoreRequest.php
# app/Http/Requests/PostUpdateRequest.php
# app/Http/Resources/PostResource.php
# resources/js/Pages/Posts/Index.tsx
# resources/js/Pages/Posts/Create.tsx
# resources/js/Pages/Posts/Edit.tsx
```

## Qo'lda yaratish — [ModuleName] o'rniga haqiqiy nom

### 1. Papkalar
```bash
mkdir -p app/Modules/Post/{Controllers,Models,Requests,Services,Migrations,Events}
mkdir -p resources/js/Pages/Post
```

### 2. ServiceProvider
```php
<?php
namespace App\Modules\Post;

use Illuminate\Support\ServiceProvider;

class PostServiceProvider extends ServiceProvider
{
    public function boot(): void
    {
        $this->loadRoutesFrom(__DIR__ . '/routes.php');
        $this->loadMigrationsFrom(__DIR__ . '/Migrations');
    }
}
```

### 3. bootstrap/providers.php ga qo'shish
```php
App\Modules\Post\PostServiceProvider::class,
```

### 4. Migration
```php
Schema::create('posts', function (Blueprint $table) {
    $table->id();
    $table->string('title');
    $table->text('body')->nullable();
    $table->enum('status', ['draft', 'published'])->default('draft');
    $table->foreignId('user_id')->constrained()->cascadeOnDelete();
    $table->timestamps();
    $table->softDeletes();
});
```

### 5. Model
```php
<?php
namespace App\Modules\Post\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Post extends Model
{
    use SoftDeletes;
    protected $fillable = ['title', 'body', 'status', 'user_id'];
}
```

### 6. Service
```php
<?php
namespace App\Modules\Post\Services;

use App\Modules\Post\Models\Post;
use Illuminate\Pagination\LengthAwarePaginator;

class PostService
{
    public function paginate(array $filters = []): LengthAwarePaginator
    {
        return Post::query()
            ->when($filters['search'] ?? null,
                fn($q, $s) => $q->where('title', 'like', "%{$s}%")
            )
            ->latest()
            ->paginate(20)
            ->withQueryString();
    }

    public function create(array $data): Post
    {
        return Post::create($data);
    }

    public function update(Post $post, array $data): Post
    {
        $post->update($data);
        return $post->fresh();
    }

    public function delete(Post $post): void
    {
        $post->delete();
    }
}
```

### 7. Controller
```php
<?php
namespace App\Modules\Post\Controllers;

use App\Shared\BaseController;
use App\Modules\Post\Models\Post;
use App\Modules\Post\Services\PostService;
use App\Modules\Post\Requests\StorePostRequest;
use App\Modules\Post\Requests\UpdatePostRequest;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;

class PostController extends BaseController
{
    public function __construct(
        private readonly PostService $service
    ) {}

    public function index(): Response
    {
        abort_unless(auth()->user()->can('posts.view'), 403);
        return Inertia::render('Post/Index', [
            'posts'   => $this->service->paginate(request()->all()),
            'filters' => request()->only('search'),
        ]);
    }

    public function create(): Response
    {
        abort_unless(auth()->user()->can('posts.create'), 403);
        return Inertia::render('Post/Create');
    }

    public function store(StorePostRequest $request): RedirectResponse
    {
        $this->service->create($request->validated());
        return redirect()->route('posts.index')->with('success', 'Post yaratildi');
    }

    public function edit(Post $post): Response
    {
        abort_unless(auth()->user()->can('posts.edit'), 403);
        return Inertia::render('Post/Edit', ['post' => $post]);
    }

    public function update(UpdatePostRequest $request, Post $post): RedirectResponse
    {
        $this->service->update($post, $request->validated());
        return redirect()->route('posts.index')->with('success', 'Yangilandi');
    }

    public function destroy(Post $post): RedirectResponse
    {
        abort_unless(auth()->user()->can('posts.delete'), 403);
        $this->service->delete($post);
        return redirect()->route('posts.index')->with('success', 'O\'chirildi');
    }
}
```

### 8. routes.php
```php
<?php
use App\Modules\Post\Controllers\PostController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])
    ->prefix('admin')->name('posts.')
    ->group(function () {
        Route::resource('posts', PostController::class);
    });
```

### 9. TypeScript type qo'shish
```typescript
// resources/js/types/models.d.ts ga qo'shish
export interface Post {
    id: number
    title: string
    body: string | null
    status: 'draft' | 'published'
    user_id: number
    created_at: string
}
```

### 10. RolePermissionSeeder ga qo'shish
```php
'posts' => ['view', 'create', 'edit', 'delete'],
```

## Tekshirish ro'yxati
- [ ] ServiceProvider providers.php da bor
- [ ] `php artisan migrate` ishladi
- [ ] `php artisan route:list | grep posts` ko'rinadi
- [ ] `php artisan db:seed --class=RolePermissionSeeder` ishladi
- [ ] `http://localhost/admin/posts` ochiladi
- [ ] CRUD to'liq ishlaydi
- [ ] TypeScript xatolik yo'q (`npm run type-check`)
