<?php

namespace App\Http\Requests\Admin;

use App\Http\Controllers\Admin\RoleController;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Validator;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class UpdateRoleRequest extends FormRequest
{
    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        /** @var Role $role */
        $role = $this->route('role');

        return [
            'name' => [
                'required',
                'string',
                'max:255',
                Rule::unique(Role::class, 'name')->where('guard_name', 'web')->ignore($role->id),
            ],
            'permissions' => ['array'],
            'permissions.*' => ['string', Rule::exists(Permission::class, 'name')],
        ];
    }

    /**
     * I ruoli di sistema sono cablati nel middleware ('role:admin') e nei layout,
     * quindi i permessi si possono cambiare ma il nome no.
     */
    public function after(): array
    {
        return [
            function (Validator $validator): void {
                /** @var Role $role */
                $role = $this->route('role');

                if (! RoleController::isSystemRole($role->name)) {
                    return;
                }

                if ($this->input('name') !== $role->name) {
                    $validator->errors()->add(
                        'name',
                        "Il ruolo di sistema «{$role->name}» non può essere rinominato.",
                    );
                }
            },
        ];
    }
}
