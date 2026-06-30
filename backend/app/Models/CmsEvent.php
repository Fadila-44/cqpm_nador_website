<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CmsEvent extends Model
{
    protected $fillable = [
        'slug',
        'category',
        'image_path',
        'icon',
        'photos',
        'content',
        'is_published',
        'sort_order',
    ];

    protected function casts(): array
    {
        return [
            'photos' => 'array',
            'content' => 'array',
            'is_published' => 'boolean',
        ];
    }
}
