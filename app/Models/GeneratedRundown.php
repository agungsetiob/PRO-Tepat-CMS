<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['event_name', 'date', 'time_info', 'location', 'pic'])]
class GeneratedRundown extends Model
{
    use HasFactory;

    /**
     * Relasi ke detail item rundown
     */
    public function items(): HasMany
    {
        return $this->hasMany(GeneratedRundownItem::class)->orderBy('sort_order', 'asc');
    }

    public function invitations(): HasMany
    {
        return $this->hasMany(GeneratedRundownInvitation::class)->orderBy('sort_order', 'asc');
    }
}
