<?php

namespace Tests\Feature\Admin;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class UserManagementTest extends TestCase
{
    use RefreshDatabase;

    private function admin(): User
    {
        return User::factory()->create()->assignRole('admin');
    }

    public function test_non_admins_cannot_reach_user_management(): void
    {
        $user = User::factory()->create()->assignRole('user');

        $this->actingAs($user)->get('/admin/users')->assertForbidden();
    }

    public function test_admin_sees_the_user_list(): void
    {
        $admin = $this->admin();
        User::factory()->create(['name' => 'Mario Rossi']);

        $this->actingAs($admin)
            ->get('/admin/users')
            ->assertOk();
    }

    public function test_user_list_can_be_searched(): void
    {
        $admin = $this->admin();
        User::factory()->create(['name' => 'Mario Rossi']);
        User::factory()->create(['name' => 'Luigi Verdi']);

        $response = $this->actingAs($admin)->get('/admin/users?search=Mario');

        $response->assertOk();
        $names = collect($response->viewData('page')['props']['users']['data'])
            ->pluck('name');

        $this->assertTrue($names->contains('Mario Rossi'));
        $this->assertFalse($names->contains('Luigi Verdi'));
    }

    public function test_admin_can_create_a_user_with_roles(): void
    {
        $admin = $this->admin();

        $this->actingAs($admin)
            ->post('/admin/users', [
                'name' => 'Nuovo Utente',
                'email' => 'nuovo@example.com',
                'password' => 'password',
                'password_confirmation' => 'password',
                'roles' => ['user'],
            ])
            ->assertRedirect('/admin/users');

        $created = User::where('email', 'nuovo@example.com')->firstOrFail();
        $this->assertTrue($created->hasRole('user'));
    }

    public function test_admin_can_update_a_user_and_its_roles(): void
    {
        $admin = $this->admin();
        $user = User::factory()->create()->assignRole('user');

        $this->actingAs($admin)
            ->put("/admin/users/{$user->id}", [
                'name' => 'Nome Aggiornato',
                'email' => 'aggiornato@example.com',
                'password' => '',
                'password_confirmation' => '',
                'roles' => ['admin'],
            ])
            ->assertRedirect('/admin/users');

        $user->refresh();

        $this->assertSame('Nome Aggiornato', $user->name);
        $this->assertSame('aggiornato@example.com', $user->email);
        $this->assertTrue($user->hasRole('admin'));
        $this->assertFalse($user->hasRole('user'));
        // L'email cambiata torna da verificare.
        $this->assertNull($user->email_verified_at);
    }

    public function test_leaving_the_password_empty_keeps_the_current_one(): void
    {
        $admin = $this->admin();
        $user = User::factory()->create()->assignRole('user');
        $originalPassword = $user->password;

        $this->actingAs($admin)->put("/admin/users/{$user->id}", [
            'name' => $user->name,
            'email' => $user->email,
            'password' => '',
            'password_confirmation' => '',
            'roles' => ['user'],
        ]);

        $this->assertSame($originalPassword, $user->refresh()->password);
    }

    public function test_admins_cannot_strip_their_own_admin_role(): void
    {
        $admin = $this->admin();

        $this->actingAs($admin)
            ->put("/admin/users/{$admin->id}", [
                'name' => $admin->name,
                'email' => $admin->email,
                'password' => '',
                'password_confirmation' => '',
                'roles' => ['user'],
            ])
            ->assertSessionHasErrors('roles');

        $this->assertTrue($admin->refresh()->hasRole('admin'));
    }

    public function test_admins_cannot_delete_themselves(): void
    {
        $admin = $this->admin();

        $this->actingAs($admin)
            ->delete("/admin/users/{$admin->id}")
            ->assertSessionHas('error');

        $this->assertModelExists($admin);
    }

    public function test_admin_can_delete_another_user(): void
    {
        $admin = $this->admin();
        $user = User::factory()->create();

        $this->actingAs($admin)
            ->delete("/admin/users/{$user->id}")
            ->assertRedirect('/admin/users');

        $this->assertModelMissing($user);
    }
}
