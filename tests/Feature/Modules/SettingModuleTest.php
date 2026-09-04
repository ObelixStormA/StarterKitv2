<?php

use App\Modules\Setting\Models\Setting;

test('a user without permission cannot see the settings page', function () {
    $user = \App\Models\User::factory()->create();

    $this->actingAs($user)
        ->get(route('settings.index'))
        ->assertForbidden();
});

test('an admin can create, update and delete a dynamic setting', function () {
    $admin = adminUser();

    $this->actingAs($admin)
        ->post(route('settings.store'), [
            'group' => 'site',
            'key' => 'tiktok_url',
            'type' => 'url',
            'value' => 'https://tiktok.com/example',
        ])
        ->assertRedirect();

    $setting = Setting::where('key', 'tiktok_url')->firstOrFail();
    expect($setting->value)->toBe('https://tiktok.com/example');

    $this->actingAs($admin)
        ->put(route('settings.update', $setting), [
            'key' => 'tiktok_url',
            'value' => 'https://tiktok.com/updated',
        ])
        ->assertRedirect();

    expect($setting->fresh()->value)->toBe('https://tiktok.com/updated');

    $this->actingAs($admin)
        ->delete(route('settings.destroy', $setting))
        ->assertRedirect();

    expect(Setting::find($setting->id))->toBeNull();
});

test('creating a setting requires a valid key format', function () {
    $admin = adminUser();

    $this->actingAs($admin)
        ->post(route('settings.store'), [
            'group' => 'site',
            'key' => 'Invalid Key!',
            'type' => 'text',
            'value' => 'x',
        ])
        ->assertSessionHasErrors('key');
});
