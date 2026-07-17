<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class GeneratedRundown extends Model
{
    use HasFactory;

    protected $fillable = ['event_name', 'date', 'time_info', 'location', 'pic'];

    /**
     * Relasi ke detail item rundown
     */
    public function items(): HasMany
    {
        return $this->hasMany(GeneratedRundownItem::class)->orderBy('sort_order', 'asc');
    }

    public function invitations()
    {
        return $this->hasMany(GeneratedRundownInvitation::class)->orderBy('sort_order', 'asc');
    }
}
