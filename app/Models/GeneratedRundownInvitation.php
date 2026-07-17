<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class GeneratedRundownInvitation extends Model
{
    use HasFactory;

    protected $fillable = [
        'generated_rundown_id',
        'honorific_id',
        'status',
        'presence_photo',
        'sort_order'
    ];

    /**
     * 2. Relasi balik ke tabel induk Rundown
     */
    public function rundown(): BelongsTo
    {
        return $this->belongsTo(GeneratedRundown::class, 'generated_rundown_id');
    }

    public function honorific(): BelongsTo
    {
        return $this->belongsTo(Honorific::class, 'honorific_id');
    }
}
