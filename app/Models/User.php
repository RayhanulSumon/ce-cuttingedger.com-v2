<?php

namespace App\Models;

use Database\Factories\UserFactory;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Collection;
use Spatie\Permission\Traits\HasRoles;

#[Fillable(['name', 'email', 'password', 'google_id', 'avatar', 'company', 'phone', 'email_verified_at', 'role_id', 'status', 'last_login_at'])]
#[Hidden(['password', 'remember_token'])]
class User extends Authenticatable implements MustVerifyEmail
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable;

    use HasRoles {
        hasRole as spatieHasRole;
    }

    protected string $guard_name = 'web';

    /**
     * Automatically synchronize role_id and Spatie roles table.
     */
    protected static function booted(): void
    {
        static::saved(function (User $user): void {
            if ($user->role_id) {
                $role = Role::find($user->role_id);
                if ($role && ! $user->spatieHasRole($role->name)) {
                    $user->syncRoles([$role->name]);
                }
            }
        });
    }

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'last_login_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * Primary Role that this user belongs to.
     *
     * @return BelongsTo<Role, $this>
     */
    public function role(): BelongsTo
    {
        return $this->belongsTo(Role::class);
    }

    /**
     * Determine if the user has a specific role via Spatie Permission or primary role.
     *
     * @param  string|int|array|\Spatie\Permission\Contracts\Role|Collection|\BackedEnum  $roles
     */
    public function hasRole($roles, ?string $guard = null): bool
    {
        if ($this->spatieHasRole($roles, $guard)) {
            return true;
        }

        if (! $this->relationLoaded('role')) {
            $this->load('role');
        }

        if (! $this->role) {
            return false;
        }

        if (is_array($roles)) {
            return in_array($this->role->name, $roles, true);
        }

        return is_string($roles) && $this->role->name === $roles;
    }

    /**
     * Helper to verify if the user is a super admin.
     */
    public function isSuperAdmin(): bool
    {
        return $this->hasRole('super_admin');
    }

    /**
     * Helper to verify if the user is an admin or super admin.
     */
    public function isAdmin(): bool
    {
        return $this->hasRole(['super_admin', 'admin']);
    }

    /**
     * Check if user account is active.
     */
    public function isActive(): bool
    {
        return $this->status === 'active';
    }

    /**
     * Orders placed by this user.
     *
     * @return HasMany<Order, $this>
     */
    public function orders(): HasMany
    {
        return $this->hasMany(Order::class);
    }
}
