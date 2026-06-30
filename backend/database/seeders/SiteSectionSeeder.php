<?php

namespace Database\Seeders;

use App\Models\SiteSection;
use Illuminate\Database\Seeder;

class SiteSectionSeeder extends Seeder
{
    public function run(): void
    {
        foreach (config('site_sections', []) as $key => $label) {
            SiteSection::firstOrCreate(
                ['key' => $key],
                ['label' => $label, 'content' => [], 'is_published' => true]
            );
        }
    }
}
