<?php

namespace App\Http\Controllers\Admin\Api;

use App\Http\Controllers\Controller;
use App\Models\CmsEvent;
use App\Services\CmsMediaService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class CmsEventController extends Controller
{
    public function __construct(private CmsMediaService $mediaService)
    {
    }

    public function index(): JsonResponse
    {
        $events = CmsEvent::query()->orderBy('sort_order')->orderByDesc('id')->get()->map(fn ($e) => $this->transform($e));

        return response()->json($events);
    }

    public function show(CmsEvent $event): JsonResponse
    {
        return response()->json($this->transform($event));
    }

    public function store(Request $request): JsonResponse
    {
        $data = $this->validated($request);
        $event = CmsEvent::create($this->buildPayload($request, $data));

        return response()->json(['message' => 'Actualité créée.', 'event' => $this->transform($event)], 201);
    }

    public function update(Request $request, CmsEvent $event): JsonResponse
    {
        $data = $this->validated($request, $event->id);
        $event->update($this->buildPayload($request, $data, $event));

        return response()->json(['message' => 'Actualité mise à jour.', 'event' => $this->transform($event->fresh())]);
    }

    public function destroy(CmsEvent $event): JsonResponse
    {
        $event->delete();

        return response()->json(['message' => 'Actualité supprimée.']);
    }

    private function transform(CmsEvent $event): array
    {
        $content = $event->content ?? [];

        return [
            'id' => $event->id,
            'slug' => $event->slug,
            'category' => $event->category,
            'icon' => $event->icon,
            'image_path' => $event->image_path,
            'image_url' => $event->image_path ? '/storage/'.$event->image_path : null,
            'is_published' => $event->is_published,
            'sort_order' => $event->sort_order,
            'title_fr' => data_get($content, 'fr.title', ''),
            'title_ar' => data_get($content, 'ar.title', ''),
            'title_en' => data_get($content, 'en.title', ''),
            'text_fr' => data_get($content, 'fr.text', ''),
            'text_ar' => data_get($content, 'ar.text', ''),
            'text_en' => data_get($content, 'en.text', ''),
            'date_fr' => data_get($content, 'fr.date', ''),
            'date_ar' => data_get($content, 'ar.date', ''),
            'date_en' => data_get($content, 'en.date', ''),
            'content' => $content,
            'created_at' => $event->created_at,
            'updated_at' => $event->updated_at,
        ];
    }

    private function validated(Request $request, ?int $ignoreId = null): array
    {
        return $request->validate([
            'slug' => ['nullable', 'string', 'max:255', 'regex:/^[a-z0-9\-_]+$/', 'unique:cms_events,slug'.($ignoreId ? ','.$ignoreId : '')],
            'category' => ['nullable', 'string', 'max:100'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
            'is_published' => ['nullable', 'boolean'],
            'icon' => ['nullable', 'string', 'max:100'],
            'title_fr' => ['required', 'string', 'max:500'],
            'title_en' => ['nullable', 'string', 'max:500'],
            'title_ar' => ['nullable', 'string', 'max:500'],
            'text_fr' => ['nullable', 'string'],
            'text_en' => ['nullable', 'string'],
            'text_ar' => ['nullable', 'string'],
            'date_fr' => ['nullable', 'string', 'max:100'],
        ]);
    }

    private function buildPayload(Request $request, array $data, ?CmsEvent $event = null): array
    {
        $content = $event?->content ?? [];
        foreach (['fr', 'en', 'ar'] as $lang) {
            $content[$lang] = [
                'title' => $request->input("title_{$lang}", data_get($content, "{$lang}.title", '')),
                'text' => $request->input("text_{$lang}", data_get($content, "{$lang}.text", '')),
                'date' => $request->input("date_{$lang}", data_get($content, "{$lang}.date", '')),
            ];
        }

        $payload = [
            'slug' => $data['slug'] ?? Str::slug($request->input('title_fr', 'event-'.time())),
            'category' => $data['category'] ?? 'Institutionnel',
            'sort_order' => $data['sort_order'] ?? 0,
            'is_published' => $request->boolean('is_published', true),
            'icon' => $data['icon'] ?? 'event',
            'content' => $content,
        ];

        if ($request->hasFile('image')) {
            $media = $this->mediaService->store($request->file('image'));
            $payload['image_path'] = $media->path;
        }

        return $payload;
    }
}
