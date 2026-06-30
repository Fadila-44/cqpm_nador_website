<?php

namespace App\Http\Controllers\Admin\Api;

use App\Http\Controllers\Controller;
use App\Models\CmsSetting;
use App\Services\CmsMediaService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SettingsController extends Controller
{
    private const KEYS = [
        'site_name_fr', 'site_name_ar', 'site_name_en',
        'description_fr', 'description_ar', 'description_en',
        'email', 'phone',
        'address_fr', 'address_ar', 'address_en',
        'facebook_url', 'twitter_url', 'linkedin_url', 'instagram_url', 'youtube_url',
        'logo_path', 'favicon_path', 'primary_color',
    ];

    public function __construct(private CmsMediaService $mediaService)
    {
    }

    public function index(): JsonResponse
    {
        $settings = CmsSetting::allAsArray();
        $data = [];

        foreach (self::KEYS as $key) {
            $data[$key] = $settings[$key] ?? $this->default($key);
        }

        $data['logo_url'] = ! empty($data['logo_path']) ? '/storage/'.$data['logo_path'] : asset('assets/cqpm-logo.jpg');
        $data['favicon_url'] = ! empty($data['favicon_path']) ? '/storage/'.$data['favicon_path'] : null;

        return response()->json($data);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'site_name_fr' => ['nullable', 'string', 'max:255'],
            'site_name_ar' => ['nullable', 'string', 'max:255'],
            'site_name_en' => ['nullable', 'string', 'max:255'],
            'description_fr' => ['nullable', 'string', 'max:5000'],
            'description_ar' => ['nullable', 'string', 'max:5000'],
            'description_en' => ['nullable', 'string', 'max:5000'],
            'email' => ['nullable', 'email', 'max:255'],
            'phone' => ['nullable', 'string', 'max:50'],
            'address_fr' => ['nullable', 'string', 'max:1000'],
            'address_ar' => ['nullable', 'string', 'max:1000'],
            'address_en' => ['nullable', 'string', 'max:1000'],
            'facebook_url' => ['nullable', 'url', 'max:500'],
            'twitter_url' => ['nullable', 'url', 'max:500'],
            'linkedin_url' => ['nullable', 'url', 'max:500'],
            'instagram_url' => ['nullable', 'url', 'max:500'],
            'youtube_url' => ['nullable', 'url', 'max:500'],
            'primary_color' => ['nullable', 'string', 'max:20'],
        ]);

        CmsSetting::setMany($data);

        return response()->json(['message' => 'Paramètres enregistrés.', 'settings' => $this->index()->getData(true)]);
    }

    public function uploadLogo(Request $request): JsonResponse
    {
        $request->validate(['logo' => ['required', 'file', 'mimes:jpg,jpeg,png,gif,webp,svg', 'max:5120']]);
        $media = $this->mediaService->store($request->file('logo'));
        CmsSetting::set('logo_path', $media->path);

        return response()->json([
            'message' => 'Logo mis à jour.',
            'logo_path' => $media->path,
            'logo_url' => '/storage/'.$media->path,
        ]);
    }

    public function uploadFavicon(Request $request): JsonResponse
    {
        $request->validate(['favicon' => ['required', 'file', 'mimes:jpg,jpeg,png,gif,webp,ico', 'max:1024']]);
        $media = $this->mediaService->store($request->file('favicon'));
        CmsSetting::set('favicon_path', $media->path);

        return response()->json([
            'message' => 'Favicon mis à jour.',
            'favicon_path' => $media->path,
            'favicon_url' => '/storage/'.$media->path,
        ]);
    }

    private function default(string $key): ?string
    {
        return match ($key) {
            'site_name_fr' => 'CQPM Nador',
            'site_name_ar' => 'مركز التأهيل المهني ناظور',
            'site_name_en' => 'CQPM Nador',
            'primary_color' => '#1E40AF',
            default => null,
        };
    }
}
