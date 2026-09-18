<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StorePermissionRequest;
use Illuminate\Http\RedirectResponse;
use Spatie\Permission\Models\Permission;

/**
 * I permessi si gestiscono dalla pagina Ruoli: sono etichette senza schermate
 * proprie, servono solo a essere spuntate su un ruolo.
 */
class PermissionController extends Controller
{
    public function store(StorePermissionRequest $request): RedirectResponse
    {
        $permission = Permission::create([
            'name' => $request->validated('name'),
            'guard_name' => 'web',
        ]);

        return back()->with('success', "Permesso «{$permission->name}» creato.");
    }

    public function destroy(Permission $permission): RedirectResponse
    {
        $name = $permission->name;
        $permission->delete();

        return back()->with('success', "Permesso «{$name}» eliminato.");
    }
}
