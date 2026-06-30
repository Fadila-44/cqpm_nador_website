<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CmsSetting;
use Illuminate\Http\JsonResponse;

class SettingsController extends Controller
{
    private const PUBLIC_KEYS = [
        'site_name_fr', 'site_name_ar', 'site_name_en',
        'description_fr', 'description_ar', 'description_en',
        'email', 'phone',
        'address_fr', 'address_ar', 'address_en',
        'facebook_url', 'twitter_url', 'linkedin_url', 'instagram_url', 'youtube_url',
        'logo_path', 'favicon_path', 'primary_color',
    ];

    public function index(): JsonResponse
    {
        return response()->json($this->publicSettings());
    }

    public static function publicSettings(): array
    {
        $settings = CmsSetting::allAsArray();
        $data = [];

        foreach (self::PUBLIC_KEYS as $key) {
            $data[$key] = $settings[$key] ?? null;
        }

        $data['logo_url'] = ! empty($data['logo_path']) ? url('storage/'.ltrim($data['logo_path'], '/')) : asset('assets/cqpm-logo.jpg');
        $data['favicon_url'] = ! empty($data['favicon_path']) ? url('storage/'.ltrim($data['favicon_path'], '/')) : null;

        return $data;
    }
}
