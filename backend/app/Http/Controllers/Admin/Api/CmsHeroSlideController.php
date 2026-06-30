<?php

namespace App\Http\Controllers\Admin\Api;

use App\Http\Controllers\Controller;
use App\Models\CmsHeroSlide;
use App\Services\CmsMediaService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CmsHeroSlideController extends Controller
{
    public function __construct(private CmsMediaService $mediaService)
    {
    }

    public function index(): JsonResponse
    {
        $query = CmsHeroSlide::query()->orderBy('sort_order');
        if (request()->filled('page')) {
            $query->where('page_slug', request()->input('page'));
        }
        $slides = $query->get()->map(fn ($s) => $this->transform($s));

        return response()->json($slides);
    }

    public function show(CmsHeroSlide $slide): JsonResponse
    {
        return response()->json($this->transform($slide));
    }

    public function store(Request $request): JsonResponse
    {
        $data = $this->validated($request);

        $payload = [
            'page_slug' => $request->input('page_slug', 'home'),
            'sort_order' => $data['sort_order'],
            'is_active' => $request->boolean('is_active', true),
            'alt' => $this->buildAlt($request),
            'content' => $this->buildContent($request),
        ];

        if ($request->hasFile('image')) {
            $media = $this->mediaService->store($request->file('image'));
            $payload['image_path'] = $media->path;
        }

        $slide = CmsHeroSlide::create($payload);

        return response()->json(['message' => 'Slide ajouté.', 'slide' => $this->transform($slide)], 201);
    }

    public function update(Request $request, CmsHeroSlide $slide): JsonResponse
    {
        $data = $this->validated($request, false);

        $payload = [
            'page_slug' => $request->input('page_slug', 'home'),
            'sort_order' => $data['sort_order'],
            'is_active' => $request->boolean('is_active'),
            'alt' => $this->buildAlt($request),
            'content' => $this->buildContent($request, $slide),
        ];

        if ($request->hasFile('image')) {
            $media = $this->mediaService->store($request->file('image'));
            $payload['image_path'] = $media->path;
        }

        $slide->update($payload);

        return response()->json(['message' => 'Slide mis à jour.', 'slide' => $this->transform($slide->fresh())]);
    }

    public function reorder(Request $request): JsonResponse
    {
        $data = $request->validate(['order' => ['required', 'array'], 'order.*' => ['integer']]);

        foreach ($data['order'] as $index => $id) {
            CmsHeroSlide::where('id', $id)->update(['sort_order' => $index]);
        }

        return response()->json(['message' => 'Ordre mis à jour.']);
    }

    public function destroy(CmsHeroSlide $slide): JsonResponse
    {
        $slide->delete();

        return response()->json(['message' => 'Slide supprimé.']);
    }

    private function transform(CmsHeroSlide $slide): array
    {
        $content = $slide->content ?? [];
        $missingTranslations = [];

        foreach (['ar', 'en'] as $lang) {
            if (empty(data_get($content, "{$lang}.title")) && empty(data_get($slide->alt, $lang))) {
                $missingTranslations[] = strtoupper($lang);
            }
        }

        return [
            'id' => $slide->id,
            'page_slug' => $slide->page_slug,
            'image_path' => $slide->image_path,
            'image_url' => $slide->image_path ? '/storage/'.$slide->image_path : null,
            'sort_order' => $slide->sort_order,
            'is_active' => $slide->is_active,
            'title_fr' => data_get($content, 'fr.title', data_get($slide->alt, 'fr', '')),
            'title_ar' => data_get($content, 'ar.title', data_get($slide->alt, 'ar', '')),
            'title_en' => data_get($content, 'en.title', data_get($slide->alt, 'en', '')),
            'subtitle_fr' => data_get($content, 'fr.subtitle', ''),
            'subtitle_ar' => data_get($content, 'ar.subtitle', ''),
            'subtitle_en' => data_get($content, 'en.subtitle', ''),
            'button_text_fr' => data_get($content, 'fr.button_text', ''),
            'button_text_ar' => data_get($content, 'ar.button_text', ''),
            'button_text_en' => data_get($content, 'en.button_text', ''),
            'button_link' => data_get($content, 'fr.button_link', data_get($content, 'en.button_link', '')),
            'content' => $content,
            'alt' => $slide->alt,
            'missing_translations' => $missingTranslations,
            'created_at' => $slide->created_at,
            'updated_at' => $slide->updated_at,
        ];
    }

    private function validated(Request $request, bool $imageRequired = true): array
    {
        return $request->validate([
            'image' => [$imageRequired ? 'required' : 'nullable', 'file', 'mimes:jpg,jpeg,png,gif,webp', 'max:10240'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
            'is_active' => ['nullable', 'boolean'],
            'page_slug' => ['nullable', 'string', 'max:100'],
        ]);
    }

    private function buildAlt(Request $request): array
    {
        $alt = [];
        foreach (['fr', 'en', 'ar'] as $lang) {
            $alt[$lang] = $request->input("title_{$lang}", $request->input("alt_{$lang}", ''));
        }

        return $alt;
    }

    private function buildContent(Request $request, ?CmsHeroSlide $slide = null): array
    {
        $content = $slide?->content ?? [];

        foreach (['fr', 'en', 'ar'] as $lang) {
            $existing = $content[$lang] ?? [];
            $content[$lang] = [
                'title' => $request->input("title_{$lang}", $existing['title'] ?? data_get($slide?->alt, $lang, '')),
                'subtitle' => $request->input("subtitle_{$lang}", $existing['subtitle'] ?? ''),
                'button_text' => $request->input("button_text_{$lang}", $existing['button_text'] ?? ''),
                'button_link' => $request->input('button_link', $existing['button_link'] ?? data_get($content, 'fr.button_link', '')),
            ];
        }

        return $content;
    }
}
