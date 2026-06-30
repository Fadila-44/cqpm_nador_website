<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\CmsHeroSlide;
use App\Services\CmsMediaService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\View\View;

class CmsHeroSlideController extends Controller
{
    public function __construct(private CmsMediaService $mediaService)
    {
    }

    public function index(): View
    {
        return view('admin.cms.slides.index', [
            'slides' => CmsHeroSlide::query()->orderBy('sort_order')->get(),
        ]);
    }

    public function create(): View
    {
        return view('admin.cms.slides.form', [
            'slide' => new CmsHeroSlide(['is_active' => true, 'alt' => []]),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $this->validated($request);

        $media = $this->mediaService->store($request->file('image'), [
            'fr' => $request->input('alt_fr', ''),
            'en' => $request->input('alt_en', ''),
            'ar' => $request->input('alt_ar', ''),
        ]);

        CmsHeroSlide::create([
            'page_slug' => $request->input('page_slug', 'home'),
            'image_path' => $media->path,
            'alt' => [
                'fr' => $request->input('alt_fr', ''),
                'en' => $request->input('alt_en', ''),
                'ar' => $request->input('alt_ar', ''),
            ],
            'sort_order' => $data['sort_order'],
            'is_active' => $request->boolean('is_active'),
        ]);

        return redirect()->route('admin.cms.slides.index')->with('success', 'Slide ajoutée.');
    }

    public function edit(CmsHeroSlide $slide): View
    {
        return view('admin.cms.slides.form', compact('slide'));
    }

    public function update(Request $request, CmsHeroSlide $slide): RedirectResponse
    {
        $data = $this->validated($request, false);

        $payload = [
            'page_slug' => $request->input('page_slug', 'home'),
            'alt' => [
                'fr' => $request->input('alt_fr', ''),
                'en' => $request->input('alt_en', ''),
                'ar' => $request->input('alt_ar', ''),
            ],
            'sort_order' => $data['sort_order'],
            'is_active' => $request->boolean('is_active'),
        ];

        if ($request->hasFile('image')) {
            $media = $this->mediaService->store($request->file('image'), $payload['alt']);
            $payload['image_path'] = $media->path;
        }

        $slide->update($payload);

        return redirect()->route('admin.cms.slides.index')->with('success', 'Slide mise à jour.');
    }

    public function destroy(CmsHeroSlide $slide): RedirectResponse
    {
        $slide->delete();

        return redirect()->route('admin.cms.slides.index')->with('success', 'Slide supprimée.');
    }

    private function validated(Request $request, bool $imageRequired = true): array
    {
        return $request->validate([
            'image' => [$imageRequired ? 'required' : 'nullable', 'file', 'mimes:jpg,jpeg,png,gif,webp', 'max:10240'],
            'alt_fr' => ['nullable', 'string', 'max:255'],
            'alt_en' => ['nullable', 'string', 'max:255'],
            'alt_ar' => ['nullable', 'string', 'max:255'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
            'is_active' => ['nullable', 'boolean'],
            'page_slug' => ['required', 'string', 'max:100'],
        ]);
    }
}
