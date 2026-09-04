<?php

use App\Models\User;

test('guests are redirected to login when visiting the users page', function () {
    $this->get(route('users.index'))->assertRedirect(route('login'));
});

test('a user without permission cannot see the users page', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->get(route('users.index'))
        ->assertForbidden();
});

test('an admin can list, create, update and delete users', function () {
    $admin = adminUser();

    $this->actingAs($admin)
        ->get(route('users.index'))
        ->assertOk();

    $this->actingAs($admin)
        ->post(route('users.store'), [
            'name' => 'Jane Doe',
            'email' => 'jane@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
            'roles' => ['user'],
        ])
        ->assertRedirect(route('users.index'));

    $created = User::where('email', 'jane@example.com')->firstOrFail();
    expect($created->hasRole('user'))->toBeTrue();

    $this->actingAs($admin)
        ->put(route('users.update', $created), [
            'name' => 'Jane Updated',
            'email' => 'jane@example.com',
            'roles' => ['user'],
        ])
        ->assertRedirect(route('users.index'));

    expect($created->fresh()->name)->toBe('Jane Updated');

    $this->actingAs($admin)
        ->delete(route('users.destroy', $created))
        ->assertRedirect(route('users.index'));

    expect(User::find($created->id))->toBeNull();
    expect(User::withTrashed()->find($created->id))->not->toBeNull();
});

test('an admin cannot delete their own account from the users list', function () {
    $admin = adminUser();

    $this->actingAs($admin)
        ->delete(route('users.destroy', $admin))
        ->assertForbidden();
});

test('a soft-deleted user can be restored and permanently deleted', function () {
    $admin = adminUser();
    $target = User::factory()->create();
    $target->delete();

    $this->actingAs($admin)
        ->get(route('users.trashed'))
        ->assertOk();

    $this->actingAs($admin)
        ->post(route('users.restore', $target->id))
        ->assertRedirect();

    expect(User::find($target->id))->not->toBeNull();

    $target->delete();

    $this->actingAs($admin)
        ->delete(route('users.force-delete', $target->id))
        ->assertRedirect();

    expect(User::withTrashed()->find($target->id))->toBeNull();
});
