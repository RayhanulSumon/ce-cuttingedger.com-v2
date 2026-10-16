<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Job extends Model
{
    use HasFactory;

    protected $table = 'career_openings';

    protected $guarded = [];

    protected $casts = [
        'responsibilities' => 'array',
        'requirements' => 'array',
        'benefits' => 'array',
        'is_open' => 'boolean',
    ];
}
