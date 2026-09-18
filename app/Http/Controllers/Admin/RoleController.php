<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreRoleRequest;
use App\Http\Requests\Admin\UpdateRoleRequest;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RoleController extends Controller
{
    /**
     * Ruoli citati direttamente nel codice (middleware 'role:admin', menu dei
     * layout, RegisteredUserController): rinominarli o cancellarli romperebbe
     * l'app, quindi restano modificabili solo nei permessi.
     *
     * @var array<int, string>
     */
    public const SYSTEM_ROLES = ['admin', 'user'];

    public static function isSystemRole(string $name): bool
    {
        return in_array($name, self::SYSTEM_ROLES, true);
    }

    public function index(): Response
    {
        $roles = Role::query()
            ->withCount('users')
            ->with('permissions:id,name')
            ->orderBy('name')
            ->get()
            ->map(fn (Role $role) => [
                'id' => $role->id,
                'name' => $role->name,
                'guard_name' => $role->guard_name,
                'users_count' => $role->users_count,
                'permissions' => $role->permissions->pluck('name')->all(),
                'is_system' => self::isSystemRole($role->name),
            ]);

        $permissions = Permission::query()
            ->withCount('roles')
            ->orderBy('name')
            ->get()
            ->map(fn (Permission $permission) => [
                'id' => $permission->id,
                'name' => $permission->name,
                'roles_count' => $permission->roles_count,
            ]);

        return Inertia::render('Admin/Roles/Index', [
            'roles' => $roles,
            'permissions' => $permissions,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Roles/Create', [
            'availablePermissions' => $this->availablePermissions(),
        ]);
    }

    public function store(StoreRoleRequest $request): RedirectResponse
    {
        $data = $request->validated();

        $role = Role::create(['name' => $data['name'], 'guard_name' => 'web']);
        $role->syncPermissions($data['permissions'] ?? []);

        return redirect()
            ->route('admin.roles.index')
            ->with('success', "Ruolo «{$role->name}» creato.");
    }

    public function edit(Role $role): Response
    {
        return Inertia::render('Admin/Roles/Edit', [
            'role' => [
                'id' => $role->id,
                'name' => $role->name,
                'permissions' => $role->permissions->pluck('name')->all(),
                'is_system' => self::isSystemRole($role->name),
            ],
            'availablePermissions' => $this->availablePermissions(),
        ]);
    }

    public function update(UpdateRoleRequest $request, Role $role): RedirectResponse
    {
        $data = $request->validated();

        $role->update(['name' => $data['name']]);
        $role->syncPermissions($data['permissions'] ?? []);

        return redirect()
            ->route('admin.roles.index')
            ->with('success', "Ruolo «{$role->name}» aggiornato.");
    }

    public function destroy(Role $role): RedirectResponse
    {
        if (self::isSystemRole($role->name)) {
            return back()->with('error', "Il ruolo di sistema «{$role->name}» non può essere eliminato.");
        }

        $name = $role->name;
        $role->delete();

        return redirect()
            ->route('admin.roles.index')
            ->with('success', "Ruolo «{$name}» eliminato.");
    }

    /**
     * @return array<int, string>
     */
    private function availablePermissions(): array
    {
        return Permission::query()->orderBy('name')->pluck('name')->all();
    }
}
