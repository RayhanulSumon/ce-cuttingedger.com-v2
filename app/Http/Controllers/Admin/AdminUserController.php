<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Permission\Models\Permission;

class AdminUserController extends Controller
{
    /**
     * Display a listing of Admin Staff and Spatie Roles & Permissions.
     */
    public function index(Request $request): Response
    {
        $adminRoles = Role::with('permissions')
            ->where('name', '!=', 'user')
            ->orderBy('id', 'asc')
            ->get()
            ->map(fn (Role $role) => [
                'id' => $role->id,
                'name' => $role->name,
                'permissions' => $role->permissions->pluck('name')->values()->all(),
            ]);

        $adminRoleIds = $adminRoles->pluck('id')->all();

        $users = User::with(['role', 'roles.permissions'])
            ->whereIn('role_id', $adminRoleIds)
            ->orderBy('id', 'asc')
            ->get()
            ->map(fn (User $user) => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role_id' => $user->role_id,
                'role_name' => $user->role?->name,
                'permissions' => $user->getAllPermissions()->pluck('name')->values()->all(),
                'status' => $user->status,
                'last_login_at' => $user->last_login_at?->diffForHumans(),
                'created_at' => $user->created_at?->format('M d, Y'),
            ]);

        $permissions = Permission::orderBy('id', 'asc')->pluck('name')->values()->all();

        return Inertia::render('Admin/Users/Index', [
            'users' => $users,
            'roles' => $adminRoles,
            'permissions' => $permissions,
        ]);
    }

    /**
     * Store a new Spatie Role with selected permissions.
     */
    public function storeRole(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:60'],
            'permissions' => ['nullable', 'array'],
            'permissions.*' => ['string', 'exists:permissions,name'],
        ]);

        $slug = Str::slug($validated['name'], '_');

        if (Role::where('name', $slug)->exists()) {
            return redirect()->back()->with('error', "Role '{$slug}' already exists.");
        }

        $role = Role::create([
            'name' => $slug,
            'guard_name' => 'web',
        ]);

        $role->syncPermissions($validated['permissions'] ?? []);

        return redirect()->back()->with('success', "Role '{$slug}' created with permissions.");
    }

    /**
     * Update an existing Spatie Role's permissions.
     */
    public function updateRole(Request $request, Role $role): RedirectResponse
    {
        $validated = $request->validate([
            'permissions' => ['nullable', 'array'],
            'permissions.*' => ['string', 'exists:permissions,name'],
        ]);

        if ($role->name === 'super_admin') {
            $role->syncPermissions(Permission::pluck('name')->all());
        } else {
            $role->syncPermissions($validated['permissions'] ?? []);
        }

        return redirect()->back()->with('success', "Permissions updated for role '{$role->name}'.");
    }

    /**
     * Delete a custom Spatie Role.
     */
    public function destroyRole(Role $role): RedirectResponse
    {
        if (in_array($role->name, ['super_admin', 'admin', 'user'], true)) {
            return redirect()->back()->with('error', 'Core system roles cannot be deleted.');
        }

        $role->delete();

        return redirect()->back()->with('success', 'Custom role deleted.');
    }

    /**
     * Display a listing of Registered Clients ONLY (user role).
     */
    public function clientAccounts(): Response
    {
        $clientRole = Role::firstOrCreate(['name' => 'user']);

        $clients = User::with('role')
            ->withCount('orders')
            ->where(function ($query) use ($clientRole) {
                $query->where('role_id', $clientRole->id)
                    ->orWhereNull('role_id');
            })
            ->orderByDesc('created_at')
            ->get()
            ->map(fn (User $user) => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'company' => $user->company,
                'phone' => $user->phone,
                'avatar' => $user->avatar,
                'google_linked' => ! empty($user->google_id),
                'status' => $user->status,
                'email_verified' => $user->hasVerifiedEmail(),
                'email_verified_at' => $user->email_verified_at?->format('M d, Y'),
                'orders_count' => $user->orders_count,
                'last_login_at' => $user->last_login_at?->diffForHumans(),
                'created_at' => $user->created_at?->format('M d, Y'),
            ]);

        return Inertia::render('Admin/ClientAccounts/Index', [
            'clients' => $clients,
            'clientRoleId' => $clientRole->id,
        ]);
    }

    /**
     * Store a newly created client or admin user.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email'],
            'company' => ['nullable', 'string', 'max:255'],
            'phone' => ['nullable', 'string', 'max:60'],
            'role_id' => ['nullable', 'exists:roles,id'],
            'status' => ['required', 'in:active,suspended'],
            'email_verified' => ['nullable', 'boolean'],
            'password' => ['required', Password::min(8)],
        ]);

        $roleId = $validated['role_id'] ?? Role::firstOrCreate(['name' => 'user'])->id;

        User::create([
            'name' => $validated['name'],
            'email' => strtolower(trim($validated['email'])),
            'company' => $validated['company'] ?? null,
            'phone' => $validated['phone'] ?? null,
            'role_id' => $roleId,
            'status' => $validated['status'],
            'email_verified_at' => ($validated['email_verified'] ?? true) ? now() : null,
            'password' => Hash::make($validated['password']),
        ]);

        return redirect()->back()->with('success', 'Account created successfully.');
    }

    /**
     * Update the specified client or admin user.
     */
    public function update(Request $request, User $user): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', Rule::unique('users')->ignore($user->id)],
            'company' => ['nullable', 'string', 'max:255'],
            'phone' => ['nullable', 'string', 'max:60'],
            'role_id' => ['nullable', 'exists:roles,id'],
            'status' => ['required', 'in:active,suspended'],
            'email_verified' => ['nullable', 'boolean'],
            'password' => ['nullable', Password::min(8)],
        ]);

        if ($user->id === $request->user()->id && $validated['status'] === 'suspended') {
            return redirect()->back()->with('error', 'You cannot suspend your own active session.');
        }

        $payload = [
            'name' => $validated['name'],
            'email' => strtolower(trim($validated['email'])),
            'company' => $validated['company'] ?? $user->company,
            'phone' => $validated['phone'] ?? $user->phone,
            'role_id' => $validated['role_id'] ?? $user->role_id,
            'status' => $validated['status'],
        ];

        if (array_key_exists('email_verified', $validated)) {
            $payload['email_verified_at'] = $validated['email_verified']
                ? ($user->email_verified_at ?? now())
                : null;
        }

        if (! empty($validated['password'])) {
            $payload['password'] = Hash::make($validated['password']);
        }

        $user->update($payload);

        return redirect()->back()->with('success', "Account for {$user->name} updated.");
    }

    /**
     * Toggle active/suspended status of user.
     */
    public function toggleStatus(Request $request, User $user): RedirectResponse
    {
        if ($user->id === $request->user()->id) {
            return redirect()->back()->with('error', 'You cannot suspend your own active account.');
        }

        $newStatus = $user->status === 'active' ? 'suspended' : 'active';
        $user->update(['status' => $newStatus]);

        return redirect()->back()->with('success', "Account status changed to {$newStatus}.");
    }

    /**
     * Manually mark a client's email address as verified.
     */
    public function verifyEmail(User $user): RedirectResponse
    {
        if (! $user->hasVerifiedEmail()) {
            $user->forceFill(['email_verified_at' => now()])->save();
        }

        return redirect()->back()->with('success', "Email verified for {$user->name}.");
    }

    /**
     * Remove the specified user.
     */
    public function destroy(Request $request, User $user): RedirectResponse
    {
        if ($user->id === $request->user()->id) {
            return redirect()->back()->with('error', 'You cannot delete your own active account.');
        }

        $name = $user->name;
        $user->delete();

        return redirect()->back()->with('success', "Account for {$name} deleted.");
    }
}
