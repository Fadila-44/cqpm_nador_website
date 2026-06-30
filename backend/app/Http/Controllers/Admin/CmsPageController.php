<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\CmsPage;
use App\Services\CmsMediaService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\View\View;

class CmsPageController extends Controller
{
    public function __construct(private CmsMediaService $mediaService)
    {
    }

    public function index(): View
    {
        return view('admin.cms.pages.index', [
            'pages' => CmsPage::query()->orderBy('sort_order')->orderBy('slug')->get(),
        ]);
    }

    public function create(): View
    {
        return view('admin.cms.pages.form', [
            'page' => new CmsPage(['template' => 'standard', 'is_published' => true, 'content' => []]),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $this->validated($request);
        $data['content'] = $this->buildContent($request);

        if ($request->hasFile('hero_image_file')) {
            $media = $this->mediaService->store($request->file('hero_image_file'));
            $data['hero_image'] = $media->path;
        }

        CmsPage::create($data);

        return redirect()->route('admin.cms.pages.index')->with('success', 'Page créée.');
    }

    public function edit(CmsPage $page): View
    {
        return view('admin.cms.pages.form', compact('page'));
    }

    public function update(Request $request, CmsPage $page): RedirectResponse
    {
        $data = $this->validated($request, $page->id);
        $data['content'] = $this->buildContent($request, $page);

        if ($request->hasFile('hero_image_file')) {
            $media = $this->mediaService->store($request->file('hero_image_file'));
            $data['hero_image'] = $media->path;
        }

        $page->update($data);

        return redirect()->route('admin.cms.pages.index')->with('success', 'Page mise à jour.');
    }

    public function destroy(CmsPage $page): RedirectResponse
    {
        $page->delete();

        return redirect()->route('admin.cms.pages.index')->with('success', 'Page supprimée.');
    }

    private function validated(Request $request, ?int $ignoreId = null): array
    {
        return $request->validate([
            'slug' => ['required', 'string', 'max:255', 'regex:/^[a-z0-9\\-\\/]+$/', 'unique:cms_pages,slug'.($ignoreId ? ','.$ignoreId : '')],
            'template' => ['required', 'in:standard,document,gallery'],
            'is_published' => ['nullable', 'boolean'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
            'hero_image_file' => ['nullable', 'file', 'mimes:jpg,jpeg,png,gif,webp', 'max:10240'],
        ] + $this->localeRules());
    }

    private function localeRules(): array
    {
        $rules = [];
        foreach (['fr', 'en', 'ar'] as $lang) {
            $rules["title_{$lang}"] = ['nullable', 'string', 'max:500'];
            $rules["eyebrow_{$lang}"] = ['nullable', 'string', 'max:500'];
            $rules["intro_{$lang}"] = ['nullable', 'string', 'max:5000'];
            $rules["body_{$lang}"] = ['nullable', 'string', 'max:50000'];
            $rules["sections_{$lang}"] = ['nullable', 'string'];
            $rules["pdf_{$lang}"] = ['nullable', 'file', 'mimes:pdf', 'max:20480'];
            $rules["gallery_{$lang}.*"] = ['nullable', 'file', 'mimes:jpg,jpeg,png,gif,webp', 'max:10240'];
        }

        return $rules;
    }

    private function buildContent(Request $request, ?CmsPage $page = null): array
    {
        $content = $page?->content ?? [];

        foreach (['fr', 'en', 'ar'] as $lang) {
            $sectionsJson = $request->input("sections_{$lang}");
            $sections = [];
            if ($sectionsJson) {
                $decoded = json_decode($sectionsJson, true);
                if (is_array($decoded)) {
                    $sections = $decoded;
                }
            } elseif (isset($content[$lang]['sections'])) {
                $sections = $content[$lang]['sections'];
            }

            $pdfPath = $content[$lang]['pdf'] ?? null;
            if ($request->hasFile("pdf_{$lang}")) {
                $media = $this->mediaService->store($request->file("pdf_{$lang}"));
                $pdfPath = $media->path;
            }

            $gallery = $content[$lang]['gallery'] ?? [];
            if ($request->hasFile("gallery_{$lang}")) {
                foreach ($request->file("gallery_{$lang}") as $file) {
                    if ($file) {
                        $media = $this->mediaService->store($file);
                        $gallery[] = $media->path;
                    }
                }
            }

            $content[$lang] = [
                'title' => $request->input("title_{$lang}", ''),
                'eyebrow' => $request->input("eyebrow_{$lang}", ''),
                'intro' => $request->input("intro_{$lang}", ''),
                'body' => $request->input("body_{$lang}", ''),
                'sections' => $sections,
                'pdf' => $pdfPath,
                'gallery' => $gallery,
            ];
        }

        return $content;
    }
}
