<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Attributes\Fillable;

#[Fillable(['jabatan', 'sapaan_resmi', 'sapaan_lisan', 'perlakuan_khusus', 'tingkat'])]
class Honorific extends Model
{
    public function scopeUrutanProtokol($query)
    {
        return $query->orderBy('tingkat');
    }
}
