<?php

namespace App\Modules\Search\Controllers;

use App\Models\User;
use App\Modules\File\Models\File;
use App\Modules\Setting\Models\Setting;
use App\Shared\BaseController;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Spatie\Permission\Models\Role;

class SearchController extends BaseController
{
    public function __invoke(Request $request): JsonResponse
    {
        $query = trim((string) $request->get('q'));
        $user = $request->user();
        $results = [];

        if ($query === '' || mb_strlen($query) < 2) {
            return response()->json(['results' => []]);
        }

        if ($user->canAny(['users.view', 'users.ownview'])) {
            User::query()
                ->where(fn ($q) => $q->where('name', 'like', "%{$query}%")->orWhere('email', 'like', "%{$query}%"))
                ->when(
                    ! $user->can('users.view'),
                    fn ($q) => $q->where('id', $user->id)
                )
                ->limit(5)
                ->get(['id', 'name', 'email'])
                ->each(function ($u) use (&$results) {
                    $results[] = [
                        'type' => 'user',
                        'label' => $u->name,
                        'description' => $u->email,
                        'url' => route('users.edit', $u->id),
                    ];
                });
        }

        if ($user->can('roles.view')) {
            Role::query()
                ->where('name', 'like', "%{$query}%")
                ->limit(5)
                ->get(['id', 'name'])
                ->each(function ($r) use (&$results) {
                    $results[] = [
                        'type' => 'role',
                        'label' => $r->name,
                        'description' => null,
                        'url' => route('roles.edit', $r->id),
                    ];
                });
        }

        if ($user->canAny(['settings.view', 'settings.ownview'])) {
            Setting::query()
                ->where(fn ($q) => $q->where('key', 'like', "%{$query}%")->orWhere('label', 'like', "%{$query}%"))
                ->limit(5)
                ->get(['id', 'key', 'label'])
                ->each(function ($s) use (&$results) {
                    $results[] = [
                        'type' => 'setting',
                        'label' => $s->label ?: $s->key,
                        'description' => $s->key,
                        'url' => route('settings.index'),
                    ];
                });
        }

        if ($user->canAny(['files.view', 'files.ownview'])) {
            File::query()
                ->where('name', 'like', "%{$query}%")
                ->when(
                    ! $user->can('files.view'),
                    fn ($q) => $q->where('user_id', $user->id)
                )
                ->limit(5)
                ->get(['id', 'name'])
                ->each(function ($f) use (&$results) {
                    $results[] = [
                        'type' => 'file',
                        'label' => $f->name,
                        'description' => null,
                        'url' => route('files.index', ['search' => $f->name]),
                    ];
                });
        }

        return response()->json(['results' => $results]);
    }
}
