<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Registration extends Model
{
    protected $fillable = [
        'training_type',
        'section',
        'last_name',
        'first_name',
        'gender',
        'email',
        'country_code',
        'phone',
        'birth_place',
        'birth_date',
        'education',
        'region',
        'city',
        'address',
        'is_read',
    ];

    protected function casts(): array
    {
        return [
            'birth_date' => 'date',
            'is_read' => 'boolean',
        ];
    }
}
