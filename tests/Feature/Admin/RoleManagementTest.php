<?php

namespace Tests\Feature\Admin;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class RoleManagementTest extends TestCase
{
    use RefreshDatabase;

    private function admin(): User
    {
        return User::factory()->create()->assignRole('admin');
    }

    public function test_non_admins_cannot_reach_role_management(): void
    {
        $user = User::factory()->create()->assignRole('user');

        $this->actingAs($user)->get('/admin/roles')->assertForbidden();
    }

    public function test_admin_sees_roles_and_permissions(): void
    {
        $admin = $this->admin();
        Permission::create(['name' => 'users.delete', 'guard_name' => 'web']);

        $this->actingAs($admin)->get('/admin/roles')->assertOk();
    }

    public function test_admin_can_create_a_role_with_permissions(): void
    {
        $admin = $this->admin();
        Permission::create(['name' => 'users.delete', 'guard_name' => 'web']);

        $this->actingAs($admin)
            ->post('/admin/roles', [
                'name' => 'editor',
                'permissions' => ['users.delete'],
            ])
            ->assertRedirect('/admin/roles');

        $role = Role::where('name', 'editor')->firstOrFail();
        $this->assertTrue($role->hasPermissionTo('users.delete'));
    }

    public function test_admin_can_update_a_custom_role(): void
    {
        $admin = $this->admin();
        Permission::create(['name' => 'posts.publish', 'guard_name' => 'web']);
        $role = Role::create(['name' => 'editor', 'guard_name' => 'web']);

        $this->actingAs($admin)
            ->put("/admin/roles/{$role->id}", [
                'name' => 'redattore',
                'permissions' => ['posts.publish'],
            ])
            ->assertRedirect('/admin/roles');

        $role->refresh();

        $this->assertSame('redattore', $role->name);
        $this->assertTrue($role->hasPermissionTo('posts.publish'));
    }

    public function test_system_roles_cannot_be_renamed(): void
    {
        $admin = $this->admin();
        $role = Role::where('name', 'admin')->firstOrFail();

        $this->actingAs($admin)
            ->put("/admin/roles/{$role->id}", [
                'name' => 'superadmin',
                'permissions' => [],
            ])
            ->assertSessionHasErrors('name');

        $this->assertSame('admin', $role->refresh()->name);
    }

    public function test_system_roles_accept_permission_changes(): void
    {
        $admin = $this->admin();
        Permission::create(['name' => 'users.delete', 'guard_name' => 'web']);
        $role = Role::where('name', 'admin')->firstOrFail();

        $this->actingAs($admin)
            ->put("/admin/roles/{$role->id}", [
                'name' => 'admin',
                'permissions' => ['users.delete'],
            ])
            ->assertRedirect('/admin/roles');

        $this->assertTrue($role->refresh()->hasPermissionTo('users.delete'));
    }

    public function test_system_roles_cannot_be_deleted(): void
    {
        $admin = $this->admin();
        $role = Role::where('name', 'user')->firstOrFail();

        $this->actingAs($admin)
            ->delete("/admin/roles/{$role->id}")
            ->assertSessionHas('error');

        $this->assertModelExists($role);
    }

    public function test_admin_can_delete_a_custom_role(): void
    {
        $admin = $this->admin();
        $role = Role::create(['name' => 'editor', 'guard_name' => 'web']);

        $this->actingAs($admin)
            ->delete("/admin/roles/{$role->id}")
            ->assertRedirect('/admin/roles');

        $this->assertModelMissing($role);
    }

    public function test_admin_can_create_and_delete_permissions(): void
    {
        $admin = $this->admin();

        $this->actingAs($admin)
            ->from('/admin/roles')
            ->post('/admin/permissions', ['name' => 'users.export'])
            ->assertRedirect('/admin/roles');

        $permission = Permission::where('name', 'users.export')->firstOrFail();

        $this->actingAs($admin)
            ->from('/admin/roles')
            ->delete("/admin/permissions/{$permission->id}")
            ->assertRedirect('/admin/roles');

        $this->assertModelMissing($permission);
    }

    public function test_duplicate_permission_names_are_rejected(): void
    {
        $admin = $this->admin();
        Permission::create(['name' => 'users.export', 'guard_name' => 'web']);

        $this->actingAs($admin)
            ->from('/admin/roles')
            ->post('/admin/permissions', ['name' => 'users.export'])
            ->assertSessionHasErrors('name');
    }
}
