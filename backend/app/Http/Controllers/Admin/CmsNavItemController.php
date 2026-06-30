<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\CmsNavItem;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\View\View;

class CmsNavItemController extends Controller
{
    public function index(): View
    {
        return view('admin.cms.nav.index', [
            'items' => CmsNavItem::query()
                ->with('children')
                ->whereNull('parent_id')
                ->orderBy('sort_order')
                ->get(),
            'parents' => CmsNavItem::query()->whereNull('parent_id')->orderBy('sort_order')->get(),
        ]);
    }

    public function create(): View
    {
        return view('admin.cms.nav.form', [
            'item' => new CmsNavItem(['is_active' => true, 'route' => 'home', 'label' => []]),
            'parents' => CmsNavItem::query()->whereNull('parent_id')->orderBy('sort_order')->get(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        CmsNavItem::create($this->payload($request));

        return redirect()->route('admin.cms.nav.index')->with('success', 'Élément de menu ajouté.');
    }

    public function edit(CmsNavItem $nav): View
    {
        return view('admin.cms.nav.form', [
            'item' => $nav,
            'parents' => CmsNavItem::query()->whereNull('parent_id')->where('id', '!=', $nav->id)->orderBy('sort_order')->get(),
        ]);
    }

    public function update(Request $request, CmsNavItem $nav): RedirectResponse
    {
        $nav->update($this->payload($request));

        return redirect()->route('admin.cms.nav.index')->with('success', 'Menu mis à jour.');
    }

    public function destroy(CmsNavItem $nav): RedirectResponse
    {
        $nav->children()->delete();
        $nav->delete();

        return redirect()->route('admin.cms.nav.index')->with('success', 'Élément supprimé.');
    }

    private function payload(Request $request): array
    {
        $data = $request->validate([
            'parent_id' => ['nullable', 'exists:cms_nav_items,id'],
            'route' => ['required', 'string', 'max:255'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
            'is_active' => ['nullable', 'boolean'],
            'label_fr' => ['required', 'string', 'max:255'],
            'label_en' => ['nullable', 'string', 'max:255'],
            'label_ar' => ['nullable', 'string', 'max:255'],
        ]);

        return [
            'parent_id' => $data['parent_id'] ?? null,
            'route' => $data['route'],
            'sort_order' => $data['sort_order'] ?? 0,
            'is_active' => $request->boolean('is_active'),
            'label' => [
                'fr' => $data['label_fr'],
                'en' => $data['label_en'] ?? $data['label_fr'],
                'ar' => $data['label_ar'] ?? $data['label_fr'],
            ],
        ];
    }
}
