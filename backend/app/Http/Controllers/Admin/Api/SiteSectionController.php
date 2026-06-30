<?php

namespace App\Http\Controllers\Admin\Api;

use App\Http\Controllers\Controller;
use App\Models\SiteSection;
use App\Services\CmsMediaService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SiteSectionController extends Controller
{
    public function __construct(private CmsMediaService $mediaService)
    {
    }

    public function index(): JsonResponse
    {
        $definitions = config('site_sections', []);

        foreach ($definitions as $key => $label) {
            SiteSection::firstOrCreate(
                ['key' => $key],
                ['label' => $label, 'content' => [], 'is_published' => true]
            );
        }

        $sections = SiteSection::query()
            ->whereIn('key', array_keys($definitions))
            ->orderBy('label')
            ->get()
            ->map(fn ($s) => $this->transform($s));

        return response()->json($sections);
    }

    public function show(string $key): JsonResponse
    {
        $section = $this->findOrCreate($key);

        return response()->json($this->transform($section));
    }

    public function update(Request $request, string $key): JsonResponse
    {
        $section = $this->findOrCreate($key);

        $data = $request->validate([
            'is_published' => ['nullable', 'boolean'],
            'hero_image_file' => ['nullable', 'file', 'mimes:jpg,jpeg,png,gif,webp', 'max:10240'],
            'pdf_file' => ['nullable', 'file', 'mimes:pdf,jpg,jpeg,png,gif,webp', 'max:20480'],
            'background_file' => ['nullable', 'file', 'mimes:jpg,jpeg,png,gif,webp', 'max:10240'],
            'content' => ['nullable', 'array'],
            'eyebrow_fr' => ['nullable', 'string'],
            'eyebrow_en' => ['nullable', 'string'],
            'eyebrow_ar' => ['nullable', 'string'],
            'title_fr' => ['nullable', 'string'],
            'title_en' => ['nullable', 'string'],
            'title_ar' => ['nullable', 'string'],
            'intro_fr' => ['nullable', 'string'],
            'intro_en' => ['nullable', 'string'],
            'intro_ar' => ['nullable', 'string'],
            'body_fr' => ['nullable', 'string'],
            'body_en' => ['nullable', 'string'],
            'body_ar' => ['nullable', 'string'],
        ]);

        $content = $request->input('content', $section->content ?? []);

        foreach (['fr', 'en', 'ar'] as $lang) {
            $existing = $content[$lang] ?? [];
            $content[$lang] = array_merge($existing, array_filter([
                'eyebrow' => $data["eyebrow_{$lang}"] ?? $existing['eyebrow'] ?? null,
                'title' => $data["title_{$lang}"] ?? $existing['title'] ?? null,
                'intro' => $data["intro_{$lang}"] ?? $existing['intro'] ?? null,
                'body' => $data["body_{$lang}"] ?? $existing['body'] ?? null,
            ], fn ($v) => $v !== null));
        }

        $payload = [
            'content' => $content,
            'is_published' => $request->boolean('is_published', $section->is_published),
        ];

        if ($request->hasFile('hero_image_file')) {
            $media = $this->mediaService->store($request->file('hero_image_file'));
            $payload['hero_image'] = $media->path;
        }

        if ($request->hasFile('pdf_file')) {
            $media = $this->mediaService->store($request->file('pdf_file'));
            foreach (['fr', 'en', 'ar'] as $lang) {
                $content[$lang]['pdf'] = $media->path;
            }
            $payload['content'] = $content;
        }

        if ($request->hasFile('background_file')) {
            $media = $this->mediaService->store($request->file('background_file'));
            foreach (['fr', 'en', 'ar'] as $lang) {
                $content[$lang]['background'] = $media->path;
            }
            $payload['content'] = $content;
        }

        $section->update($payload);

        return response()->json([
            'message' => 'Section mise à jour.',
            'section' => $this->transform($section->fresh()),
        ]);
    }

    private function findOrCreate(string $key): SiteSection
    {
        $label = config("site_sections.{$key}");
        abort_unless($label, 404);

        return SiteSection::firstOrCreate(
            ['key' => $key],
            ['label' => $label, 'content' => [], 'is_published' => true]
        );
    }

    private function transform(SiteSection $section): array
    {
        $content = $section->content ?? [];

        return [
            'id' => $section->id,
            'key' => $section->key,
            'label' => $section->label,
            'hero_image' => $section->hero_image,
            'hero_image_url' => $section->hero_image ? '/storage/'.$section->hero_image : null,
            'hero_slides' => $section->hero_slides ?? [],
            'is_published' => $section->is_published,
            'content' => $content,
            'eyebrow_fr' => data_get($content, 'fr.eyebrow', ''),
            'eyebrow_ar' => data_get($content, 'ar.eyebrow', ''),
            'eyebrow_en' => data_get($content, 'en.eyebrow', ''),
            'title_fr' => data_get($content, 'fr.title', ''),
            'title_ar' => data_get($content, 'ar.title', ''),
            'title_en' => data_get($content, 'en.title', ''),
            'intro_fr' => data_get($content, 'fr.intro', ''),
            'intro_ar' => data_get($content, 'ar.intro', ''),
            'intro_en' => data_get($content, 'en.intro', ''),
            'body_fr' => data_get($content, 'fr.body', ''),
            'body_ar' => data_get($content, 'ar.body', ''),
            'body_en' => data_get($content, 'en.body', ''),
            'pdf_fr' => data_get($content, 'fr.pdf', ''),
            'hero' => data_get($content, 'fr.hero', []),
            'hero_title' => data_get($content, 'fr.hero_title', ''),
            'infra_blocks' => data_get($content, 'fr.infra_blocks', []),
            'presentation' => data_get($content, 'fr.presentation', []),
            'director' => data_get($content, 'fr.director', []),
            'document' => data_get($content, 'fr.document', []),
            'distribution' => data_get($content, 'fr.distribution', []),
            'programs' => data_get($content, 'fr.programs', []),
            'feature' => data_get($content, 'fr.feature', []),
            'explore' => data_get($content, 'fr.explore', []),
            'modules_detail' => data_get($content, 'fr.modules_detail', []),
            'info_blocks' => data_get($content, 'fr.info_blocks', []),
            'form_fields' => data_get($content, 'fr.form_fields', []),
            'contact_info' => data_get($content, 'fr.contact_info', []),
            'gallery_items' => data_get($content, 'fr.gallery_items', []),
            'background' => data_get($content, 'fr.background', ''),
            'background_url' => data_get($content, 'fr.background') ? '/storage/'.data_get($content, 'fr.background') : null,
            'missions' => data_get($content, 'fr.missions', []),
            'objectives' => data_get($content, 'fr.objectives', []),
            'partners' => data_get($content, 'fr.partners', []),
            'stats' => data_get($content, 'fr.stats', []),
            'modules' => data_get($content, 'fr.modules', []),
            'sections' => data_get($content, 'fr.sections', []),
            'updated_at' => $section->updated_at,
        ];
    }
}
