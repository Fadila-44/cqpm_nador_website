<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CmsHeroSlide extends Model
{
    protected $fillable = [
        'page_slug',
        'image_path',
        'alt',
        'sort_order',
        'is_active',
        'content',
    ];

    protected function casts(): array
    {
        return [
            'alt' => 'array',
            'content' => 'array',
            'is_active' => 'boolean',
        ];
    }

    public function altFor(string $lang): string
    {
        return data_get($this->alt, $lang, data_get($this->alt, 'fr', ''));
    }
}
