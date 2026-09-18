<?php

use App\Http\Controllers\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Admin\PermissionController as AdminPermissionController;
use App\Http\Controllers\Admin\RoleController as AdminRoleController;
use App\Http\Controllers\Admin\UserController as AdminUserController;
use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'phpVersion' => PHP_VERSION,
    ]);
})->name('home');

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// Area admin: protetta da role:admin (alias registrato in bootstrap/app.php).
// prefix('admin') => URL /admin/*, name('admin.') => rotte admin.dashboard ecc.
Route::middleware(['auth', 'verified', 'role:admin'])
    ->prefix('admin')
    ->name('admin.')
    ->group(function () {
        Route::get('/', [AdminDashboardController::class, 'index'])->name('dashboard');

        Route::resource('users', AdminUserController::class)->except(['show']);
        Route::resource('roles', AdminRoleController::class)->except(['show']);

        // I permessi non hanno schermate proprie: si creano ed eliminano
        // dalla pagina Ruoli.
        Route::post('permissions', [AdminPermissionController::class, 'store'])
            ->name('permissions.store');
        Route::delete('permissions/{permission}', [AdminPermissionController::class, 'destroy'])
            ->name('permissions.destroy');
    });

require __DIR__.'/auth.php';
