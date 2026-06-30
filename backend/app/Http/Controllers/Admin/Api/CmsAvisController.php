<?php

namespace App\Http\Controllers\Admin\Api;

use App\Http\Controllers\Controller;
use App\Models\CmsAvis;
use App\Services\CmsMediaService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class CmsAvisController extends Controller
{
    public const CATEGORIES = ['stagiaires', 'admission', 'examens', 'calendrier', 'notes', 'communiques'];

    public function __construct(private CmsMediaService $mediaService)
    {
    }

    public function index(): JsonResponse
    {
        $items = CmsAvis::query()->orderBy('sort_order')->orderByDesc('id')->get()->map(fn($a) => $this->transform($a));

        return response()->json($items);
    }

    public function show(CmsAvis $avis): JsonResponse
    {
        return response()->json($this->transform($avis));
    }

    public function store(Request $request): JsonResponse
    {
        $data = $this->validated($request);
        $avis = CmsAvis::create($this->buildPayload($request, $data));

        return response()->json(['message' => 'Avis créé.', 'avis' => $this->transform($avis)], 201);
    }

    public function update(Request $request, CmsAvis $avis): JsonResponse
    {
        $data = $this->validated($request, $avis->id);
        $avis->update($this->buildPayload($request, $data, $avis));

        return response()->json(['message' => 'Avis mis à jour.', 'avis' => $this->transform($avis->fresh())]);
    }

    public function destroy(CmsAvis $avis): JsonResponse
    {
        $avis->delete();

        return response()->json(['message' => 'Avis supprimé.']);
    }

    private function transform(CmsAvis $avis): array
    {
        $content = $avis->content ?? [];

        return [
            'pdf_path' => $avis->pdf_path,
            'pdf_url' => $avis->pdf_path ? '/storage/' . $avis->pdf_path : null,
            'id' => $avis->id,
            'slug' => $avis->slug,
            'category' => $avis->category,
            'image_path' => $avis->image_path,
            'image_url' => $avis->image_path ? '/storage/' . $avis->image_path : null,
            'photos' => collect($avis->photos ?? [])->map(fn($p) => [
                'path' => $p['path'] ?? $p,
                'url' => '/storage/' . ($p['path'] ?? $p),
            ])->values(),
            'is_published' => $avis->is_published,
            'sort_order' => $avis->sort_order,
            'title_fr' => data_get($content, 'fr.title', ''),
            'title_ar' => data_get($content, 'ar.title', ''),
            'title_en' => data_get($content, 'en.title', ''),
            'text_fr' => data_get($content, 'fr.text', ''),
            'text_ar' => data_get($content, 'ar.text', ''),
            'text_en' => data_get($content, 'en.text', ''),
            'date_fr' => data_get($content, 'fr.date', ''),
            'date_ar' => data_get($content, 'ar.date', ''),
            'date_en' => data_get($content, 'en.date', ''),
            'updated_fr' => data_get($content, 'fr.updated', ''),
            'updated_ar' => data_get($content, 'ar.updated', ''),
            'updated_en' => data_get($content, 'en.updated', ''),
            'content' => $content,
            'created_at' => $avis->created_at,
            'updated_at' => $avis->updated_at,
        ];
    }

    private function validated(Request $request, ?int $ignoreId = null): array
    {
        return $request->validate([
            'slug' => ['nullable', 'string', 'max:255', 'regex:/^[a-z0-9\-_]+$/', 'unique:cms_avis,slug' . ($ignoreId ? ',' . $ignoreId : '')],
            'category' => ['nullable', 'string', 'in:' . implode(',', self::CATEGORIES)],
            'sort_order' => ['nullable', 'integer', 'min:0'],
            'is_published' => ['nullable', 'boolean'],
            'title_fr' => ['required', 'string', 'max:500'],
            'title_en' => ['nullable', 'string', 'max:500'],
            'title_ar' => ['nullable', 'string', 'max:500'],
            'text_fr' => ['nullable', 'string'],
            'text_en' => ['nullable', 'string'],
            'text_ar' => ['nullable', 'string'],
            'date_fr' => ['nullable', 'string', 'max:100'],
            'date_en' => ['nullable', 'string', 'max:100'],
            'date_ar' => ['nullable', 'string', 'max:100'],
            'updated_fr' => ['nullable', 'string', 'max:100'],
            'updated_en' => ['nullable', 'string', 'max:100'],
            'updated_ar' => ['nullable', 'string', 'max:100'],
            'image' => ['nullableRequest', 'image', 'max:5120'],
            'photos.*' => ['nullable', 'image', 'max:5120'],
            'remove_photos' => ['nullable', 'array'],
            'remove_photos.*' => ['string'],
            'pdf' => ['nullable', 'file', 'mimes:pdf', 'max:10240'],
            'remove_pdf' => ['nullable', 'boolean'],
        ]);
    }

    private function buildPayload($request, array $data, ?CmsAvis $avis = null): array
    {
        $content = $avis?->content ?? [];
        foreach (['fr', 'en', 'ar'] as $lang) {
            $content[$lang] = [
                'title' => $request->input("title_{$lang}", data_get($content, "{$lang}.title", '')),
                'text' => $request->input("text_{$lang}", data_get($content, "{$lang}.text", '')),
                'date' => $request->input("date_{$lang}", data_get($content, "{$lang}.date", '')),
                'updated' => $request->input("updated_{$lang}", data_get($content, "{$lang}.updated", '')),
            ];
        }

        $payload = [
            'slug' => $data['slug'] ?? ($avis?->slug ?? Str::slug($request->input('title_fr', 'avis-' . time())) . '-' . Str::random(6)),
            'category' => $data['category'] ?? ($avis?->category ?? 'communiques'),
            'sort_order' => $data['sort_order'] ?? ($avis?->sort_order ?? 0),
            'is_published' => $request->boolean('is_published', true),
            'content' => $content,
        ];

        if ($request->hasFile('image')) {
            $media = $this->mediaService->store($request->file('image'));
            $payload['image_path'] = $media->path;
        }

        // Démarre depuis les photos existantes (sauf celles marquées pour suppression)
        $existingPhotos = collect($avis?->photos ?? [])
            ->map(fn($p) => is_array($p) ? ($p['path'] ?? null) : $p)
            ->filter()
            ->values();

        $toRemove = collect($request->input('remove_photos', []));
        $keptPhotos = $existingPhotos->reject(fn($path) => $toRemove->contains($path))->values();
        if ($request->boolean('remove_pdf')) {
            $payload['pdf_path'] = null;
        } elseif ($request->hasFile('pdf')) {
            $pdfMedia = $this->mediaService->store($request->file('pdf'));
            $payload['pdf_path'] = $pdfMedia->path;
        }
        // Ajoute les nouvelles photos uploadées
        $newPhotoPaths = collect($request->file('photos', []))
            ->filter()
            ->map(function ($file) {
                $media = $this->mediaService->store($file);

                return $media->path;
            });

        $finalPhotos = $keptPhotos->merge($newPhotoPaths)->map(fn($path) => ['path' => $path])->values()->all();

        if ($avis !== null || $request->hasFile('photos') || $toRemove->isNotEmpty()) {
            $payload['photos'] = $finalPhotos;
        }

        return $payload;
    }
}