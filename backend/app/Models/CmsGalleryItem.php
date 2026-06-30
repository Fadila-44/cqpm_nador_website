<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CmsGalleryItem extends Model
{
    protected $fillable = [
        'category',
        'image_path',
        'title',
        'is_featured',
        'is_wide',
        'is_published',
        'sort_order',
    ];

    protected function casts(): array
    {
        return [
            'title' => 'array',
            'is_featured' => 'boolean',
            'is_wide' => 'boolean',
            'is_published' => 'boolean',
        ];
    }
}
