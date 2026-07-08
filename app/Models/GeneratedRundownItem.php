<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class GeneratedRundownItem extends Model
{
    use HasFactory;

    protected $fillable = ['generated_rundown_id', 'master_agenda_id', 'start_time', 'end_time', 'sort_order'];

    /**
     * Relasi balik ke tabel induk rundown
     */
    public function rundown(): BelongsTo
    {
        return $this->belongsTo(GeneratedRundown::class);
    }

    /**
     * Relasi untuk mengambil nama teks aktivitas dari tabel master
     */
    public function masterAgenda(): BelongsTo
    {
        return $this->belongsTo(MasterAgenda::class);
    }
}