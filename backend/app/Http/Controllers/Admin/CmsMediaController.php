<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\CmsMedia;
use App\Services\CmsMediaService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\View\View;

class CmsMediaController extends Controller
{
    public function __construct(private CmsMediaService $mediaService)
    {
    }

    public function index(): View
    {
        return view('admin.cms.media.index', [
            'media' => CmsMedia::query()->latest()->paginate(24),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'files' => ['required'],
            'files.*' => ['file', 'mimes:jpg,jpeg,png,gif,webp,pdf', 'max:20480'],
        ]);

        foreach ($request->file('files', []) as $file) {
            $this->mediaService->store($file);
        }

        return back()->with('success', 'Fichier(s) téléversé(s).');
    }

    public function destroy(CmsMedia $medium): RedirectResponse
    {
        $this->mediaService->delete($medium);

        return back()->with('success', 'Fichier supprimé.');
    }
}
