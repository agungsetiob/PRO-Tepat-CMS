<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphToMany;

#[Fillable(['scenario_id', 'title', 'content', 'image_infographic', 'references', 'order'])]
class Protocol extends Model
{
    public function scenario(): BelongsTo 
    {
        return $this->belongsTo(Scenario::class);
    }

    public function seatingRules(): HasMany 
    {
        return $this->hasMany(SeatingRule::class)->orderBy('order');
    }

    public function tags(): MorphToMany 
    {
        return $this->morphToMany(Tag::class, 'taggable');
    }

    protected $casts = [
        'references' => 'array' // ["Pasal 13 UU No 9/2010"]
    ];
}
