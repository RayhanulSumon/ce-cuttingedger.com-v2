<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Client extends Model
{
    use HasFactory;

    protected $guarded = [];

    protected $casts = [
        'marquee_row' => 'integer',
        'sort_order' => 'integer',
    ];
}
