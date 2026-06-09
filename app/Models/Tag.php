<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphToMany;

class Tag extends Model
{
    protected $fillable = [
        'name',
        'slug'
    ];

    public function scenarios(): MorphToMany 
    {
        return $this->morphedByMany(Scenario::class, 'taggable');
    }

    public function protocols(): MorphToMany 
    {
        return $this->morphedByMany(Protocol::class, 'taggable');
    }

    public function honorifics(): MorphToMany 
    {
        return $this->morphedByMany(Honorific::class, 'taggable');
    }
}