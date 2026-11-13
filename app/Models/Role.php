<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Spatie\Permission\Models\Role as SpatieRole;

class Role extends SpatieRole
{
    use HasFactory;

    /**
     * Default attributes for new Role instances.
     *
     * @var array<string, mixed>
     */
    protected $attributes = [
        'guard_name' => 'web',
    ];
}
