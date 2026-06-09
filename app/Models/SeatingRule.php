<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['protocol_id', 'position_label', 'honorific_id', 'note', 'order'])]
class SeatingRule extends Model
{
    public function protocol(): BelongsTo 
    {
        return $this->belongsTo(Protocol::class);
    }
    public function honorific(): BelongsTo
    {
        return $this->belongsTo(Honorific::class);
    }
}
