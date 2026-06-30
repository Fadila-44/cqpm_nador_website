<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\CmsEvent;
use App\Services\CmsMediaService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\View\View;

class CmsEventController extends Controller
{
    public function __construct(private CmsMediaService $mediaService)
    {
    }

    public function index(): View
    {
        return view('admin.events.index', [
            'events' => CmsEvent::query()->orderBy('sort_order')->orderByDesc('id')->get(),
        ]);
    }

    public function create(): View
    {
        return view('admin.events.form', [
            'event' => new CmsEvent(['is_published' => true, 'category' => 'Institutionnel', 'content' => []]),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $this->validated($request);
        $payload = $this->buildPayload($request, $data);
        CmsEvent::create($payload);

        return redirect()->route('admin.events.index')->with('success', 'Événement créé.');
    }

    public function edit(CmsEvent $event): View
    {
        return view('admin.events.form', compact('event'));
    }

    public function update(Request $request, CmsEvent $event): RedirectResponse
    {
        $data = $this->validated($request, $event->id);
        $event->update($this->buildPayload($request, $data, $event));

        return redirect()->route('admin.events.index')->with('success', 'Événement mis à jour.');
    }

    public function destroy(CmsEvent $event): RedirectResponse
    {
        $event->delete();

        return redirect()->route('admin.events.index')->with('success', 'Événement supprimé.');
    }

    private function validated(Request $request, ?int $ignoreId = null): array
    {
        return $request->validate([
            'slug' => ['required', 'string', 'max:255', 'regex:/^[a-z0-9\\-_]+$/', 'unique:cms_events,slug'.($ignoreId ? ','.$ignoreId : '')],
            'category' => ['required', 'string', 'max:100'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
            'is_published' => ['nullable', 'boolean'],
            'icon' => ['nullable', 'string', 'max:100'],
            'image' => ['nullable', 'file', 'mimes:jpg,jpeg,png,gif,webp', 'max:10240'],
            'date_fr' => ['nullable', 'string', 'max:100'],
            'date_en' => ['nullable', 'string', 'max:100'],
            'date_ar' => ['nullable', 'string', 'max:100'],
            'title_fr' => ['required', 'string', 'max:500'],
            'title_en' => ['nullable', 'string', 'max:500'],
            'title_ar' => ['nullable', 'string', 'max:500'],
            'text_fr' => ['nullable', 'string'],
            'text_en' => ['nullable', 'string'],
            'text_ar' => ['nullable', 'string'],
        ]);
    }

    private function buildPayload(Request $request, array $data, ?CmsEvent $existing = null): array
    {
        $payload = [
            'slug' => $data['slug'],
            'category' => $data['category'],
            'sort_order' => $data['sort_order'] ?? 0,
            'is_published' => $request->boolean('is_published'),
            'icon' => $data['icon'] ?? null,
            'content' => [
                'fr' => ['date' => $data['date_fr'] ?? '', 'title' => $data['title_fr'], 'text' => $data['text_fr'] ?? ''],
                'en' => ['date' => $data['date_en'] ?? '', 'title' => $data['title_en'] ?? $data['title_fr'], 'text' => $data['text_en'] ?? ''],
                'ar' => ['date' => $data['date_ar'] ?? '', 'title' => $data['title_ar'] ?? $data['title_fr'], 'text' => $data['text_ar'] ?? ''],
            ],
        ];

        if ($request->hasFile('image')) {
            $media = $this->mediaService->store($request->file('image'));
            $payload['image_path'] = $media->path;
        } elseif ($existing) {
            $payload['image_path'] = $existing->image_path;
        }

        return $payload;
    }
}
