<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Prop condivise con OGNI pagina Inertia (accessibili in React via usePage().props).
     *
     * - auth.user: null se ospite, altrimenti dati utente + ruoli/permessi Spatie
     *   (roles/permissions sono array di stringhe, usati nei layout per mostrare/nascondere voci).
     * - flash: messaggi one-shot messi in sessione dai controller (session()->flash('success', ...)).
     *   Wrappati in closure => valutati lazy, solo quando davvero letti dal frontend.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $user = $request->user();

        return [
            ...parent::share($request),
            'auth' => [
                'user' => $user ? [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'email_verified_at' => $user->email_verified_at,
                    'roles' => $user->getRoleNames()->toArray(),
                    'permissions' => $user->getAllPermissions()->pluck('name')->toArray(),
                ] : null,
            ],
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
            ],
        ];
    }
}
