<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['scenario_id', 'name', 'category'])]
class EventEquipment extends Model
{
    public function scenario(): BelongsTo 
    {
        return $this->belongsTo(Scenario::class);
    }
}
