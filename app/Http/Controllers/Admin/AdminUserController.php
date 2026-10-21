<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;
use Inertia\Response;

class AdminUserController extends Controller
{
    /**
     * Display a listing of all users and roles.
     */
    public function index(Request $request): Response
    {
        $users = User::with('role')
            ->orderBy('id', 'asc')
            ->get()
            ->map(fn ($user) => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role_id' => $user->role_id,
                'role_name' => $user->role?->name,
                'status' => $user->status,
                'last_login_at' => $user->last_login_at?->diffForHumans(),
                'created_at' => $user->created_at?->format('M d, Y'),
            ]);

        $roles = Role::orderBy('id', 'asc')->get(['id', 'name']);

        return Inertia::render('Admin/Users/Index', [
            'users' => $users,
            'roles' => $roles,
        ]);
    }

    /**
     * Store a newly created user with role.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email'],
            'role_id' => ['required', 'exists:roles,id'],
            'status' => ['required', 'in:active,suspended'],
            'password' => ['required', Password::defaults()],
        ]);

        $validated['password'] = Hash::make($validated['password']);

        User::create($validated);

        return redirect()->back()->with('success', 'User account commissioned successfully.');
    }

    /**
     * Update the specified user and assigned role.
     */
    public function update(Request $request, User $user): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', Rule::unique('users')->ignore($user->id)],
            'role_id' => ['required', 'exists:roles,id'],
            'status' => ['required', 'in:active,suspended'],
            'password' => ['nullable', Password::defaults()],
        ]);

        // Prevent disabling the currently logged-in Super Admin
        if ($user->id === $request->user()->id && $validated['status'] === 'suspended') {
            return redirect()->back()->with('error', 'Cannot suspend your own active Super Admin session.');
        }

        if (! empty($validated['password'])) {
            $validated['password'] = Hash::make($validated['password']);
        } else {
            unset($validated['password']);
        }

        $user->update($validated);

        return redirect()->back()->with('success', "User [{$user->name}] updated successfully.");
    }

    /**
     * Toggle active/suspended status of user.
     */
    public function toggleStatus(Request $request, User $user): RedirectResponse
    {
        if ($user->id === $request->user()->id) {
            return redirect()->back()->with('error', 'Cannot alter your own active status.');
        }

        $newStatus = $user->status === 'active' ? 'suspended' : 'active';
        $user->update(['status' => $newStatus]);

        return redirect()->back()->with('success', "User status transitioned to {$newStatus}.");
    }

    /**
     * Remove the specified user.
     */
    public function destroy(Request $request, User $user): RedirectResponse
    {
        if ($user->id === $request->user()->id) {
            return redirect()->back()->with('error', 'Cannot delete your own active administrator account.');
        }

        $name = $user->name;
        $user->delete();

        return redirect()->back()->with('success', "User [{$name}] purged successfully.");
    }
}
