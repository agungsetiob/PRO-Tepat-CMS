<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class GeneratedRundown extends Model
{
    use HasFactory;

    // Daftarkan field yang boleh diisi massal dari API mobile
    protected $fillable = ['event_name', 'date', 'time_info', 'location', 'pic'];

    /**
     * Relasi ke detail item rundown
     */
    public function items(): HasMany
    {
        // Diurutkan berdasarkan sort_order agar baris rundown rapi berurutan saat ditarik
        return $this->hasMany(GeneratedRundownItem::class)->orderBy('sort_order', 'asc');
    }
}