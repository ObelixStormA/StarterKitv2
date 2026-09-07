<?php

namespace App\Modules\Menu\Models;

use App\Shared\Traits\Auditable;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

#[Fillable(['key', 'name'])]
class Menu extends Model
{
    use HasFactory, SoftDeletes, Auditable;

    public function items(): HasMany
    {
        return $this->hasMany(MenuItem::class);
    }

    /** Faqat ildiz (parentsiz) item'lar — tree shu yerdan quriladi. */
    public function rootItems(): HasMany
    {
        return $this->items()->whereNull('parent_id')->orderBy('order');
    }
}
