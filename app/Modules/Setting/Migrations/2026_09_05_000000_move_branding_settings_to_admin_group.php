<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    protected array $keys = ['site_name', 'site_logo', 'site_favicon'];

    public function up(): void
    {
        DB::table('settings')
            ->where('group', 'site')
            ->whereIn('key', $this->keys)
            ->update(['group' => 'admin']);
    }

    public function down(): void
    {
        DB::table('settings')
            ->where('group', 'admin')
            ->whereIn('key', $this->keys)
            ->update(['group' => 'site']);
    }
};
