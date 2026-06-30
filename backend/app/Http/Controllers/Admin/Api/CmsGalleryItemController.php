<?php

namespace App\Http\Controllers\Admin\Api;

use App\Http\Controllers\Controller;
use App\Models\CmsGalleryItem;
use App\Services\CmsMediaService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CmsGalleryItemController extends Controller
{
    public function __construct(private CmsMediaService $mediaService)
    {
    }

    public function index(Request $request): JsonResponse
    {
        $query = CmsGalleryItem::query()->orderBy('sort_order')->orderByDesc('id');

        if ($request->filled('category') && $request->category !== 'Toutes') {
            $query->where('category', $request->category);
        }

        return response()->json($query->get()->map(fn (CmsGalleryItem $item) => $this->transform($item)));
    }

    public function show(CmsGalleryItem $gallery): JsonResponse
    {
        return response()->json($this->transform($gallery));
    }

    public function store(Request $request): JsonResponse
    {
        $data = $this->validated($request, true);
        $media = $this->mediaService->store($request->file('image'));

        $item = CmsGalleryItem::create($this->payload($request, $data, $media->path));

        return response()->json(['message' => 'Photo ajoutée.', 'item' => $this->transform($item)], 201);
    }

    public function update(Request $request, CmsGalleryItem $gallery): JsonResponse
    {
        $data = $this->validated($request, false);
        $imagePath = $gallery->image_path;

        if ($request->hasFile('image')) {
            $media = $this->mediaService->store($request->file('image'));
            $imagePath = $media->path;
        }

        $gallery->update($this->payload($request, $data, $imagePath));

        return response()->json(['message' => 'Photo mise à jour.', 'item' => $this->transform($gallery->fresh())]);
    }

    public function destroy(CmsGalleryItem $gallery): JsonResponse
    {
        $gallery->delete();

        return response()->json(['message' => 'Photo supprimée.']);
    }

    private function transform(CmsGalleryItem $item): array
    {
        return [
            'id' => $item->id,
            'category' => $item->category,
            'title' => $item->title ?? [],
            'title_fr' => data_get($item->title, 'fr', ''),
            'title_en' => data_get($item->title, 'en', ''),
            'title_ar' => data_get($item->title, 'ar', ''),
            'image_path' => $item->image_path,
            'image_url' => $item->image_path ? '/storage/'.$item->image_path : null,
            'is_featured' => $item->is_featured,
            'is_wide' => $item->is_wide,
            'is_published' => $item->is_published,
            'sort_order' => $item->sort_order,
            'created_at' => $item->created_at,
            'updated_at' => $item->updated_at,
        ];
    }

    private function validated(Request $request, bool $imageRequired): array
    {
        return $request->validate([
            'category' => ['required', 'string', 'max:100'],
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

    private function payload(Request $request, array $data, string $imagePath): array
    {
        return [
            'category' => $data['category'],
            'image_path' => $imagePath,
            'title' => [
                'fr' => $data['title_fr'],
                'en' => $data['title_en'] ?? $data['title_fr'],
                'ar' => $data['title_ar'] ?? $data['title_fr'],
            ],
            'is_featured' => $request->boolean('is_featured'),
            'is_wide' => $request->boolean('is_wide'),
            'is_published' => $request->boolean('is_published', true),
            'sort_order' => $data['sort_order'] ?? 0,
        ];
    }
}
