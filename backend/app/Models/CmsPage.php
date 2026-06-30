<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CmsPage extends Model
{
    protected $fillable = [
        'slug',
        'template',
        'hero_image',
        'content',
        'is_published',
        'sort_order',
    ];

    protected function casts(): array
    {
        return [
            'content' => 'array',
            'is_published' => 'boolean',
        ];
    }

    public function localized(string $lang, string $key, mixed $default = ''): mixed
    {
        return data_get($this->content, "{$lang}.{$key}", data_get($this->content, "fr.{$key}", $default));
    }
}
