<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreRegistrationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'training_type' => ['required', 'string', 'max:255'],
            'section' => ['required', 'string', 'max:255'],
            'last_name' => ['required', 'string', 'max:255'],
            'first_name' => ['required', 'string', 'max:255'],
            'gender' => ['required', 'string', 'max:50'],
            'email' => ['required', 'email', 'max:255'],
            'country_code' => ['required', 'string', 'max:10'],
            'phone' => ['required', 'string', 'max:30'],
            'birth_place' => ['required', 'string', 'max:255'],
            'birth_day' => ['required', 'string', 'max:2'],
            'birth_month' => ['required', 'string', 'max:2'],
            'birth_year' => ['required', 'string', 'max:4'],
            'education' => ['required', 'string', 'max:255'],
            'region' => ['required', 'string', 'max:255'],
            'city' => ['required', 'string', 'max:255'],
            'address' => ['required', 'string', 'max:2000'],
        ];
    }
}
