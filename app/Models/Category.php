<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['name', 'slug', 'icon', 'type', 'order'])]
class Category extends Model
{
    public function scenarios(): HasMany 
    {
        return $this->hasMany(Scenario::class)
            ->where('is_active', true)
            ->orderBy('order');
    }
}
