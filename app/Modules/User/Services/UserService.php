<?php

namespace App\Modules\User\Services;

use App\Models\User;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Hash;

class UserService
{
    public function paginate(array $filters = []): LengthAwarePaginator
    {
        return User::query()
            ->with('roles')
            ->when(
                $filters['search'] ?? null,
                fn ($q, $s) => $q->where(fn ($q) => $q
                    ->where('name', 'like', "%{$s}%")
                    ->orWhere('email', 'like', "%{$s}%"))
            )
            ->when(
                $filters['only_self_id'] ?? null,
                fn ($q, $id) => $q->where('id', $id)
            )
            ->latest()
            ->paginate(15)
            ->withQueryString();
    }

    public function create(array $data): User
    {
        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
        ]);

        $user->syncRoles($data['roles'] ?? []);

        return $user;
    }

    public function update(User $user, array $data): User
    {
        $user->update([
            'name' => $data['name'],
            'email' => $data['email'],
            ...(!empty($data['password']) ? ['password' => Hash::make($data['password'])] : []),
        ]);

        $user->syncRoles($data['roles'] ?? []);

        return $user->fresh();
    }

    public function delete(User $user): void
    {
        $user->delete();
    }
}
