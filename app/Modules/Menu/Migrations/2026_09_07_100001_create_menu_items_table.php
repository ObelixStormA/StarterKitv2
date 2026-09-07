<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('menu_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('menu_id')->constrained()->cascadeOnDelete();
            $table->foreignId('parent_id')->nullable()->constrained('menu_items')->cascadeOnDelete();
            $table->string('label');
            $table->string('icon')->nullable();
            $table->string('url')->nullable();
            $table->enum('target', ['_self', '_blank'])->default('_self');
            $table->string('permission')->nullable()->comment("Vergul bilan ajratilgan ruxsatlar ro'yxati (istalgan biri yetarli)");
            $table->boolean('requires_local')->default(false)->comment("true bo'lsa, faqat local muhitda ko'rsatiladi");
            $table->unsignedInteger('order')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('menu_items');
    }
};
