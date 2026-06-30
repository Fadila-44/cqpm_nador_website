<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CmsAvis extends Model
{
    protected $table = 'cms_avis';

    protected $fillable = [
        'slug',
        'category',
        'image_path',
        'photos',
        'pdf_path',
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