<?php

namespace App\Http\Requests\Admin;

use App\Models\User;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;
use Illuminate\Validation\Validator;
use Spatie\Permission\Models\Role;

class UpdateUserRequest extends FormRequest
{
    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        /** @var User $user */
        $user = $this->route('user');

        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => [
                'required',
                'string',
                'lowercase',
                'email',
                'max:255',
                Rule::unique(User::class)->ignore($user->id),
            ],
            // Password opzionale in modifica: se vuota, resta quella attuale.
            'password' => ['nullable', 'confirmed', Password::defaults()],
            'roles' => ['array'],
            'roles.*' => ['string', Rule::exists(Role::class, 'name')],
        ];
    }

    /**
     * Impedisce all'admin collegato di togliersi il proprio ruolo admin e
     * restare chiuso fuori dall'area di amministrazione.
     */
    public function after(): array
    {
        return [
            function (Validator $validator): void {
                /** @var User $user */
                $user = $this->route('user');

                if (! $user->is($this->user())) {
                    return;
                }

                if (! in_array('admin', $this->input('roles', []), true)) {
                    $validator->errors()->add(
                        'roles',
                        'Non puoi rimuovere il ruolo admin dal tuo account.',
                    );
                }
            },
        ];
    }
}
