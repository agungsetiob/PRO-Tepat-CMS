<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphToMany;

#[Fillable(['category_id', 'title', 'slug', 'description', 'thumbnail', 'layout_type', 'jenis_acara', 'order', 'is_active'])]
class Scenario extends Model
{
    public function category(): BelongsTo 
    {
        return $this->belongsTo(Category::class);
    }

    public function protocols(): HasMany 
    {
        return $this->hasMany(Protocol::class)->orderBy('order');
    }

    public function checklists(): HasMany 
    {
        return $this->hasMany(EventChecklist::class)->orderBy('order');
    }

    public function equipments(): HasMany 
    {
        return $this->hasMany(EventEquipment::class);
    }

    public function tags(): MorphToMany 
    {
        return $this->morphToMany(Tag::class, 'taggable');
    }
    
    protected function casts(): array
    {
        return [
            'is_active' => 'boolean' // ["Pasal 13 UU No 9/2010"]
        ];
    }
}
