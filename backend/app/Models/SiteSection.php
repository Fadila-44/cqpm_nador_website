<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SiteSection extends Model
{
    protected $fillable = [
        'key',
        'label',
        'hero_image',
        'hero_slides',
        'content',
        'is_published',
    ];

    protected function casts(): array
    {
        return [
            'hero_slides' => 'array',
            'content' => 'array',
            'is_published' => 'boolean',
        ];
    }
}
