<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\CmsGalleryItem;
use App\Services\CmsMediaService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\View\View;

class CmsGalleryItemController extends Controller
{
    public function __construct(private CmsMediaService $mediaService)
    {
    }

    public function index(): View
    {
        return view('admin.gallery.index', [
            'items' => CmsGalleryItem::query()->orderBy('sort_order')->orderByDesc('id')->get(),
        ]);
    }

    public function create(): View
    {
        return view('admin.gallery.form', [
            'item' => new CmsGalleryItem(['is_published' => true, 'category' => 'Formation', 'title' => []]),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $this->validated($request, true);
        $media = $this->mediaService->store($request->file('image'));

        CmsGalleryItem::create([
            'category' => $data['category'],
            'image_path' => $media->path,
            'title' => [
                'fr' => $data['title_fr'],
                'en' => $data['title_en'] ?? $data['title_fr'],
                'ar' => $data['title_ar'] ?? $data['title_fr'],
            ],
            'is_featured' => $request->boolean('is_featured'),
            'is_wide' => $request->boolean('is_wide'),
            'is_published' => $request->boolean('is_published'),
            'sort_order' => $data['sort_order'] ?? 0,
        ]);

        return redirect()->route('admin.gallery.index')->with('success', 'Photo ajoutée.');
    }

    public function edit(CmsGalleryItem $gallery): View
    {
        return view('admin.gallery.form', ['item' => $gallery]);
    }

    public function update(Request $request, CmsGalleryItem $gallery): RedirectResponse
    {
        $data = $this->validated($request, false);
        $payload = [
            'category' => $data['category'],
            'title' => [
                'fr' => $data['title_fr'],
                'en' => $data['title_en'] ?? $data['title_fr'],
                'ar' => $data['title_ar'] ?? $data['title_fr'],
            ],
            'is_featured' => $request->boolean('is_featured'),
            'is_wide' => $request->boolean('is_wide'),
            'is_published' => $request->boolean('is_published'),
            'sort_order' => $data['sort_order'] ?? 0,
        ];

        if ($request->hasFile('image')) {
            $media = $this->mediaService->store($request->file('image'));
            $payload['image_path'] = $media->path;
        }

        $gallery->update($payload);

        return redirect()->route('admin.gallery.index')->with('success', 'Photo mise à jour.');
    }

    public function destroy(CmsGalleryItem $gallery): RedirectResponse
    {
        $gallery->delete();

        return redirect()->route('admin.gallery.index')->with('success', 'Photo supprimée.');
    }

    private function validated(Request $request, bool $imageRequired): array
    {
        return $request->validate([
            'category' => ['required', 'in:Formation,Compus,Activités'],
            'title_fr' => ['required', 'string', 'max:255'],
            'title_en' => ['nullable', 'string', 'max:255'],
            'title_ar' => ['nullable', 'string', 'max:255'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
            'is_featured' => ['nullable', 'boolean'],
            'is_wide' => ['nullable', 'boolean'],
            'is_published' => ['nullable', 'boolean'],
            'image' => [$imageRequired ? 'required' : 'nullable', 'file', 'mimes:jpg,jpeg,png,gif,webp', 'max:10240'],
        ]);
    }
}
