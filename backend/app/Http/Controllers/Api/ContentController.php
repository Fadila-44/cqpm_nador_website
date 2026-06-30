<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CmsAvis;
use App\Models\CmsEvent;
use App\Models\CmsGalleryItem;
use App\Models\CmsHeroSlide;
use App\Models\CmsNavItem;
use App\Models\CmsPage;
use App\Models\SiteSection;
use App\Http\Controllers\Api\SettingsController;
use Illuminate\Http\JsonResponse;

class ContentController extends Controller
{
    public function index(): JsonResponse
    {
        $pages = CmsPage::query()
            ->where('is_published', true)
            ->orderBy('sort_order')
            ->get()
            ->map(fn(CmsPage $page) => $this->formatPage($page));

        $slides = CmsHeroSlide::query()
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->get()
            ->map(fn(CmsHeroSlide $slide) => [
                'id' => $slide->id,
                'page_slug' => $slide->page_slug ?? 'home',
                'src' => $this->publicUrl($slide->image_path),
                'alt' => $slide->alt ?? [],
            ]);

        $slidesByPage = $slides->groupBy('page_slug')->map->values();

        $nav = CmsNavItem::query()
            ->where('is_active', true)
            ->whereNull('parent_id')
            ->with(['children' => fn($q) => $q->where('is_active', true)->orderBy('sort_order')])
            ->orderBy('sort_order')
            ->get()
            ->map(fn(CmsNavItem $item) => $this->formatNavItem($item));

        $events = CmsEvent::query()
            ->where('is_published', true)
            ->orderBy('sort_order')
            ->orderByDesc('id')
            ->get()
            ->map(fn(CmsEvent $event) => $this->formatEvent($event));

        $avis = CmsAvis::query()
            ->where('is_published', true)
            ->orderBy('sort_order')
            ->orderByDesc('id')
            ->get()
            ->map(fn(CmsAvis $item) => $this->formatAvis($item));

        $gallery = CmsGalleryItem::query()
            ->where('is_published', true)
            ->orderBy('sort_order')
            ->orderByDesc('id')
            ->get()
            ->map(fn(CmsGalleryItem $item) => $this->formatGalleryItem($item));

        $sections = SiteSection::query()
            ->where('is_published', true)
            ->get()
            ->mapWithKeys(fn(SiteSection $section) => [
                $section->key => $this->formatSection($section),
            ]);

        return response()->json([
            'pages' => $pages->keyBy('slug'),
            'heroSlides' => $slides->values(),
            'heroSlidesByPage' => $slidesByPage,
            'navigation' => $nav->values(),
            'events' => $events->values(),
            'avis' => $avis->values(),
            'gallery' => $gallery->values(),
            'sections' => $sections,
            'settings' => SettingsController::publicSettings(),
        ]);
    }

    public function show(string $slug): JsonResponse
    {
        $page = CmsPage::query()
            ->where('slug', $slug)
            ->where('is_published', true)
            ->firstOrFail();

        return response()->json([
            'data' => $this->formatPage($page),
        ]);
    }

    private function formatPage(CmsPage $page): array
    {
        $content = $page->content ?? [];
        $heroImage = $page->hero_image ? $this->publicUrl($page->hero_image) : null;

        foreach (['fr', 'en', 'ar'] as $lang) {
            if (!isset($content[$lang])) {
                continue;
            }

            if (!empty($content[$lang]['hero_image'])) {
                $content[$lang]['hero_image'] = $this->publicUrl($content[$lang]['hero_image']);
            }

            if (!empty($content[$lang]['sections']) && is_array($content[$lang]['sections'])) {
                $content[$lang]['sections'] = array_map(function ($section) {
                    if (!empty($section['url']) && !str_starts_with($section['url'], 'http')) {
                        $section['url'] = $this->publicUrl($section['url']);
                    }
                    if (!empty($section['image']) && !str_starts_with($section['image'], 'http')) {
                        $section['image'] = $this->publicUrl($section['image']);
                    }

                    return $section;
                }, $content[$lang]['sections']);
            }
        }

        return [
            'id' => $page->id,
            'slug' => $page->slug,
            'template' => $page->template,
            'hero_image' => $heroImage,
            'content' => $content,
        ];
    }

    private function formatNavItem(CmsNavItem $item): array
    {
        return [
            'id' => $item->id,
            'label' => $item->label ?? [],
            'route' => $item->route,
            'items' => $item->children->map(fn(CmsNavItem $child) => [
                'id' => $child->id,
                'label' => $child->label ?? [],
                'route' => $child->route,
            ])->values()->all(),
        ];
    }

    private function formatEvent(CmsEvent $event): array
    {
        $content = $event->content ?? [];

        return [
            'id' => $event->id,
            'slug' => $event->slug,
            'category' => $event->category,
            'icon' => $event->icon,
            'image' => $event->image_path ? $this->publicUrl($event->image_path) : null,
            'photos' => collect($event->photos ?? [])->map(fn($p) => is_array($p) ? array_merge($p, ['src' => $this->publicUrl($p['src'] ?? $p['path'] ?? '')]) : $p)->values(),
            'content' => $content,
            'fr' => $content['fr'] ?? [],
            'en' => $content['en'] ?? [],
            'ar' => $content['ar'] ?? [],
            'date' => [
                'fr' => data_get($content, 'fr.date', ''),
                'en' => data_get($content, 'en.date', ''),
                'ar' => data_get($content, 'ar.date', ''),
            ],
        ];
    }

    private function formatAvis(CmsAvis $avis): array
    {
        $content = $avis->content ?? [];

        return [
            'pdf' => $avis->pdf_path ? [
                'url' => $this->publicUrl($avis->pdf_path),
            ] : null,
            'id' => $avis->id,
            'slug' => $avis->slug,
            'category' => $avis->category,
            'image' => $avis->image_path ? $this->publicUrl($avis->image_path) : null,
            'photos' => collect($avis->photos ?? [])
                ->map(fn($p) => $this->publicUrl(is_array($p) ? ($p['path'] ?? '') : $p))
                ->filter()
                ->values(),
            'content' => $content,
            'fr' => $content['fr'] ?? [],
            'en' => $content['en'] ?? [],
            'ar' => $content['ar'] ?? [],
            'date' => [
                'fr' => data_get($content, 'fr.date', ''),
                'en' => data_get($content, 'en.date', ''),
                'ar' => data_get($content, 'ar.date', ''),
            ],
            'updated' => [
                'fr' => data_get($content, 'fr.updated', ''),
                'en' => data_get($content, 'en.updated', ''),
                'ar' => data_get($content, 'ar.updated', ''),
            ],
        ];
    }

    private function formatGalleryItem(CmsGalleryItem $item): array
    {
        return [
            'id' => $item->id,
            'category' => $item->category,
            'title' => $item->title ?? [],
            'image' => $this->publicUrl($item->image_path),
            'featured' => $item->is_featured,
            'wide' => $item->is_wide,
        ];
    }

    private function formatSection(SiteSection $section): array
    {
        $content = $section->content ?? [];
        foreach (['fr', 'en', 'ar'] as $lang) {
            if (!empty($content[$lang]['pdf'])) {
                $content[$lang]['pdf'] = $this->publicUrl($content[$lang]['pdf']);
            }

            if (!empty($content[$lang]['partners']) && is_array($content[$lang]['partners'])) {
                $content[$lang]['partners'] = array_map(function ($partner) {
                    if (!empty($partner['logo_url'])) {
                        $partner['logo_url'] = $this->publicUrl($partner['logo_url']);
                    } elseif (!empty($partner['logo'])) {
                        $partner['logo_url'] = $this->publicUrl($partner['logo']);
                    }

                    return $partner;
                }, $content[$lang]['partners']);
            }
        }

        return [
            'key' => $section->key,
            'label' => $section->label,
            'hero_image' => $section->hero_image ? $this->publicUrl($section->hero_image) : null,
            'hero_slides' => collect($section->hero_slides ?? [])->map(function ($slide) {
                if (!empty($slide['image'])) {
                    $slide['image'] = $this->publicUrl($slide['image']);
                }

                return $slide;
            })->values(),
            'content' => $content,
        ];
    }

    private function publicUrl(string $path): string
    {
        if (str_starts_with($path, 'http://') || str_starts_with($path, 'https://')) {
            return $path;
        }

        if (str_starts_with($path, '/storage/')) {
            return url(ltrim($path, '/'));
        }

        return url('storage/' . ltrim($path, '/'));
    }
}