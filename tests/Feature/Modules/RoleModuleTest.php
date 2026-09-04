<?php

use App\Models\User;
use Spatie\Permission\Models\Role;

test('a user without permission cannot see the roles page', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->get(route('roles.index'))
        ->assertForbidden();
});

test('an admin can create, update and delete a role', function () {
    $admin = adminUser();

    $this->actingAs($admin)
        ->post(route('roles.store'), [
            'name' => 'editor',
            'permissions' => ['files.view', 'files.create'],
        ])
        ->assertRedirect(route('roles.index'));

    $role = Role::where('name', 'editor')->firstOrFail();
    expect($role->hasPermissionTo('files.view'))->toBeTrue();

    $this->actingAs($admin)
        ->put(route('roles.update', $role), [
            'name' => 'editor',
            'permissions' => ['files.view'],
        ])
        ->assertRedirect(route('roles.index'));

    expect($role->fresh()->hasPermissionTo('files.create'))->toBeFalse();

    $this->actingAs($admin)
        ->delete(route('roles.destroy', $role))
        ->assertRedirect(route('roles.index'));

    expect(Role::find($role->id))->toBeNull();
});

test('the admin role cannot be deleted', function () {
    $admin = adminUser();
    $adminRole = Role::where('name', 'admin')->firstOrFail();

    $this->actingAs($admin)
        ->delete(route('roles.destroy', $adminRole))
        ->assertForbidden();
});
