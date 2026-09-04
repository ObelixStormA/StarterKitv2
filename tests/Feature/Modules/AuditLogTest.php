<?php

use App\Modules\Audit\Models\AuditLog;
use App\Modules\Setting\Models\Setting;

test('updating a setting writes an audit log entry', function () {
    $admin = adminUser();
    $setting = Setting::create([
        'group' => 'site',
        'key' => 'site_name',
        'type' => 'text',
        'value' => 'Old Name',
    ]);

    $this->actingAs($admin)->put(route('settings.update', $setting), [
        'key' => 'site_name',
        'value' => 'New Name',
    ]);

    $log = AuditLog::where('auditable_type', Setting::class)
        ->where('auditable_id', $setting->id)
        ->where('action', 'updated')
        ->first();

    expect($log)->not->toBeNull();
    expect($log->user_id)->toBe($admin->id);
    expect($log->changes)->toHaveKey('value');
});

test('a user without permission cannot view the audit log', function () {
    $user = \App\Models\User::factory()->create();

    $this->actingAs($user)
        ->get(route('audit.index'))
        ->assertForbidden();
});

test('an admin can view the audit log', function () {
    $admin = adminUser();

    $this->actingAs($admin)
        ->get(route('audit.index'))
        ->assertOk();
});
