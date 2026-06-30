<?php

namespace App\Http\Controllers\Admin\Api;

use App\Http\Controllers\Controller;
use App\Models\CmsNavItem;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CmsNavItemController extends Controller
{
    public function index(): JsonResponse
    {
        $items = CmsNavItem::query()
            ->with('children')
            ->whereNull('parent_id')
            ->orderBy('sort_order')
            ->get()
            ->map(fn ($item) => $this->transform($item, true));

        return response()->json($items);
    }

    public function show(CmsNavItem $nav): JsonResponse
    {
        return response()->json($this->transform($nav, true));
    }

    public function store(Request $request): JsonResponse
    {
        $item = CmsNavItem::create($this->payload($request));

        return response()->json(['message' => 'Élément de menu ajouté.', 'item' => $this->transform($item)], 201);
    }

    public function update(Request $request, CmsNavItem $nav): JsonResponse
    {
        $nav->update($this->payload($request));

        return response()->json(['message' => 'Menu mis à jour.', 'item' => $this->transform($nav->fresh())]);
    }

    public function reorder(Request $request): JsonResponse
    {
        $data = $request->validate(['order' => ['required', 'array'], 'order.*' => ['integer']]);

        foreach ($data['order'] as $index => $id) {
            CmsNavItem::where('id', $id)->update(['sort_order' => $index]);
        }

        return response()->json(['message' => 'Ordre mis à jour.']);
    }

    public function destroy(CmsNavItem $nav): JsonResponse
    {
        $nav->children()->delete();
        $nav->delete();

        return response()->json(['message' => 'Élément supprimé.']);
    }

    private function transform(CmsNavItem $item, bool $withChildren = false): array
    {
        $label = $item->label ?? [];
        $missingTranslations = [];

        foreach (['ar', 'en'] as $lang) {
            if (empty($label[$lang])) {
                $missingTranslations[] = strtoupper($lang);
            }
        }

        $data = [
            'id' => $item->id,
            'parent_id' => $item->parent_id,
            'route' => $item->route,
            'url' => $item->route,
            'sort_order' => $item->sort_order,
            'is_active' => $item->is_active,
            'open_in_new_tab' => $item->open_in_new_tab ?? false,
            'label' => $label,
            'label_fr' => data_get($label, 'fr', ''),
            'label_ar' => data_get($label, 'ar', ''),
            'label_en' => data_get($label, 'en', ''),
            'missing_translations' => $missingTranslations,
        ];

        if ($withChildren && $item->relationLoaded('children')) {
            $data['children'] = $item->children->map(fn ($child) => $this->transform($child))->values();
        }

        return $data;
    }

    private function payload(Request $request): array
    {
        $data = $request->validate([
            'parent_id' => ['nullable', 'exists:cms_nav_items,id'],
            'route' => ['required', 'string', 'max:255'],
            'url' => ['nullable', 'string', 'max:255'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
            'is_active' => ['nullable', 'boolean'],
            'open_in_new_tab' => ['nullable', 'boolean'],
            'label_fr' => ['required', 'string', 'max:255'],
            'label_en' => ['nullable', 'string', 'max:255'],
            'label_ar' => ['nullable', 'string', 'max:255'],
        ]);

        return [
            'parent_id' => $data['parent_id'] ?? null,
            'route' => $data['url'] ?? $data['route'],
            'sort_order' => $data['sort_order'] ?? 0,
            'is_active' => $request->boolean('is_active', true),
            'open_in_new_tab' => $request->boolean('open_in_new_tab'),
            'label' => [
                'fr' => $data['label_fr'],
                'en' => $data['label_en'] ?? $data['label_fr'],
                'ar' => $data['label_ar'] ?? $data['label_fr'],
            ],
        ];
    }
}
