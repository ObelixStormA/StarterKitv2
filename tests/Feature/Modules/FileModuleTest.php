<?php

use App\Modules\File\Models\File;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

beforeEach(function () {
    Storage::fake('public');
});

test('a user without permission cannot see the files page', function () {
    $user = \App\Models\User::factory()->create();

    $this->actingAs($user)
        ->get(route('files.index'))
        ->assertForbidden();
});

test('a user can upload, view, soft-delete, restore and permanently delete their own file', function () {
    $admin = adminUser();

    $this->actingAs($admin)
        ->post(route('files.store'), [
            'files' => [UploadedFile::fake()->image('logo.png', 100, 100)],
        ])
        ->assertRedirect();

    $file = File::firstOrFail();
    expect($file->category)->toBe('image');
    Storage::disk('public')->assertExists($file->path);

    $this->actingAs($admin)
        ->get(route('files.index'))
        ->assertOk();

    $this->actingAs($admin)
        ->delete(route('files.destroy', $file))
        ->assertRedirect();

    expect(File::find($file->id))->toBeNull();
    Storage::disk('public')->assertExists($file->path);

    $this->actingAs($admin)
        ->post(route('files.restore', $file->id))
        ->assertRedirect();

    expect(File::find($file->id))->not->toBeNull();

    $file->delete();

    $this->actingAs($admin)
        ->delete(route('files.force-delete', $file->id))
        ->assertRedirect();

    expect(File::withTrashed()->find($file->id))->toBeNull();
    Storage::disk('public')->assertMissing($file->path);
});

test('a plain user with ownview can only see their own files', function () {
    $owner = \App\Models\User::factory()->create();
    $owner->assignRole('user');

    $other = \App\Models\User::factory()->create();
    $other->assignRole('user');

    $mine = File::factory()->for($owner)->create();
    File::factory()->for($other)->create();

    $response = $this->actingAs($owner)->get(route('files.index'));
    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->where('files.total', 1)
        ->where('files.data.0.id', $mine->id)
    );
});
