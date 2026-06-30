<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SiteSection;
use App\Services\CmsMediaService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\View\View;

class SiteSectionController extends Controller
{
    public function __construct(private CmsMediaService $mediaService)
    {
    }

    public function index(): View
    {
        $definitions = config('site_sections', []);

        foreach ($definitions as $key => $label) {
            SiteSection::firstOrCreate(
                ['key' => $key],
                ['label' => $label, 'content' => [], 'is_published' => true]
            );
        }

        $sections = SiteSection::query()->whereIn('key', array_keys($definitions))->orderBy('label')->get();

        return view('admin.sections.index', ['sections' => $sections]);
    }

    public function edit(string $key): View
    {
        $label = config("site_sections.{$key}");
        abort_unless($label, 404);

        $section = SiteSection::firstOrCreate(
            ['key' => $key],
            ['label' => $label, 'content' => [], 'is_published' => true]
        );

        return view('admin.sections.form', compact('section'));
    }

    public function update(Request $request, string $key): RedirectResponse
    {
        $label = config("site_sections.{$key}");
        abort_unless($label, 404);

        $section = SiteSection::firstOrCreate(
            ['key' => $key],
            ['label' => $label, 'content' => [], 'is_published' => true]
        );
        $data = $request->validate([
            'is_published' => ['nullable', 'boolean'],
            'hero_image_file' => ['nullable', 'file', 'mimes:jpg,jpeg,png,gif,webp', 'max:10240'],
            'pdf_file' => ['nullable', 'file', 'mimes:pdf', 'max:20480'],
            'content_json' => ['nullable', 'string'],
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

        $content = $section->content ?? [];
        if (! empty($data['content_json'])) {
            $decoded = json_decode($data['content_json'], true);
            if (is_array($decoded)) {
                $content = $decoded;
            }
        }

        foreach (['fr', 'en', 'ar'] as $lang) {
            $content[$lang] = array_merge($content[$lang] ?? [], array_filter([
                'eyebrow' => $data["eyebrow_{$lang}"] ?? null,
                'title' => $data["title_{$lang}"] ?? null,
                'intro' => $data["intro_{$lang}"] ?? null,
                'body' => $data["body_{$lang}"] ?? null,
            ], fn ($v) => $v !== null && $v !== ''));
        }

        $payload = [
            'content' => $content,
            'is_published' => $request->boolean('is_published'),
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

        $section->update($payload);

        return redirect()->route('admin.sections.index')->with('success', 'Section mise à jour.');
    }
}
