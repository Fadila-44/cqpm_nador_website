<?php

namespace App\Http\Controllers\Admin\Api;

use App\Http\Controllers\Controller;
use App\Models\CmsPage;
use App\Services\CmsMediaService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class CmsPageController extends Controller
{
    public function __construct(private CmsMediaService $mediaService)
    {
    }

    public function index(Request $request): JsonResponse
    {
        $query = CmsPage::query()->orderBy('sort_order')->orderBy('slug');

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('slug', 'like', "%{$search}%")
                    ->orWhere('content->fr->title', 'like', "%{$search}%");
            });
        }

        $pages = $query->paginate($request->integer('per_page', 10));

        $pages->getCollection()->transform(fn ($page) => $this->transform($page));

        return response()->json($pages);
    }

    public function show(CmsPage $page): JsonResponse
    {
        return response()->json($this->transform($page));
    }

    public function store(Request $request): JsonResponse
    {
        $data = $this->validated($request);
        $data['content'] = $this->buildContent($request);

        if ($request->hasFile('hero_image_file')) {
            $media = $this->mediaService->store($request->file('hero_image_file'));
            $data['hero_image'] = $media->path;
        }

        $page = CmsPage::create($data);

        return response()->json(['message' => 'Page créée.', 'page' => $this->transform($page)], 201);
    }

    public function update(Request $request, CmsPage $page): JsonResponse
    {
        $data = $this->validated($request, $page->id);
        $data['content'] = $this->buildContent($request, $page);

        if ($request->hasFile('hero_image_file')) {
            $media = $this->mediaService->store($request->file('hero_image_file'));
            $data['hero_image'] = $media->path;
        }

        $page->update($data);

        return response()->json(['message' => 'Page mise à jour.', 'page' => $this->transform($page->fresh())]);
    }

    public function destroy(CmsPage $page): JsonResponse
    {
        $page->delete();

        return response()->json(['message' => 'Page supprimée.']);
    }

    private function transform(CmsPage $page): array
    {
        $content = $page->content ?? [];
        $missingTranslations = [];

        foreach (['ar', 'en'] as $lang) {
            if (empty($content[$lang]['title'])) {
                $missingTranslations[] = strtoupper($lang);
            }
        }

        return [
            'id' => $page->id,
            'slug' => $page->slug,
            'template' => $page->template,
            'hero_image' => $page->hero_image,
            'is_published' => $page->is_published,
            'sort_order' => $page->sort_order,
            'content' => $content,
            'title_fr' => data_get($content, 'fr.title', ''),
            'title_ar' => data_get($content, 'ar.title', ''),
            'title_en' => data_get($content, 'en.title', ''),
            'meta_title_fr' => data_get($content, 'fr.meta_title', ''),
            'meta_title_ar' => data_get($content, 'ar.meta_title', ''),
            'meta_title_en' => data_get($content, 'en.meta_title', ''),
            'meta_description_fr' => data_get($content, 'fr.meta_description', ''),
            'meta_description_ar' => data_get($content, 'ar.meta_description', ''),
            'meta_description_en' => data_get($content, 'en.meta_description', ''),
            'body_fr' => data_get($content, 'fr.body', ''),
            'body_ar' => data_get($content, 'ar.body', ''),
            'body_en' => data_get($content, 'en.body', ''),
            'missing_translations' => $missingTranslations,
            'updated_at' => $page->updated_at,
            'created_at' => $page->created_at,
        ];
    }

    private function validated(Request $request, ?int $ignoreId = null): array
    {
        $data = $request->validate([
            'slug' => ['required', 'string', 'max:255', 'regex:/^[a-z0-9\-\/]+$/', 'unique:cms_pages,slug'.($ignoreId ? ','.$ignoreId : '')],
            'template' => ['nullable', 'in:standard,document,gallery'],
            'is_published' => ['nullable', 'boolean'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
            'hero_image_file' => ['nullable', 'file', 'mimes:jpg,jpeg,png,gif,webp', 'max:10240'],
        ]);

        return [
            'slug' => $data['slug'],
            'template' => $data['template'] ?? 'standard',
            'is_published' => $request->boolean('is_published', true),
            'sort_order' => $data['sort_order'] ?? 0,
        ];
    }

    private function buildContent(Request $request, ?CmsPage $page = null): array
    {
        $content = $page?->content ?? [];

        foreach (['fr', 'en', 'ar'] as $lang) {
            $existing = $content[$lang] ?? [];
            $content[$lang] = array_merge($existing, [
                'title' => $request->input("title_{$lang}", $existing['title'] ?? ''),
                'body' => $request->input("body_{$lang}", $existing['body'] ?? ''),
                'meta_title' => $request->input("meta_title_{$lang}", $existing['meta_title'] ?? ''),
                'meta_description' => $request->input("meta_description_{$lang}", $existing['meta_description'] ?? ''),
                'eyebrow' => $existing['eyebrow'] ?? '',
                'intro' => $existing['intro'] ?? '',
                'sections' => $existing['sections'] ?? [],
                'pdf' => $existing['pdf'] ?? null,
                'gallery' => $existing['gallery'] ?? [],
            ]);
        }

        return $content;
    }
}
