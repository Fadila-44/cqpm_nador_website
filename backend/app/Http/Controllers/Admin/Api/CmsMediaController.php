<?php

namespace App\Http\Controllers\Admin\Api;

use App\Http\Controllers\Controller;
use App\Models\CmsMedia;
use App\Services\CmsMediaService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CmsMediaController extends Controller
{
    public function __construct(private CmsMediaService $mediaService)
    {
    }

    public function index(Request $request): JsonResponse
    {
        $query = CmsMedia::query()->latest();

        if ($request->filled('type')) {
            if ($request->type === 'images') {
                $query->where('mime_type', 'like', 'image/%');
            } elseif ($request->type === 'documents') {
                $query->where('mime_type', 'not like', 'image/%');
            }
        }

        if ($request->filled('search')) {
            $query->where('filename', 'like', '%'.$request->search.'%');
        }

        $media = $query->paginate($request->integer('per_page', 24));
        $media->getCollection()->transform(fn ($m) => $this->transform($m));

        return response()->json($media);
    }

    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'files' => ['required'],
            'files.*' => ['file', 'mimes:jpg,jpeg,png,gif,webp,pdf', 'max:20480'],
            'file' => ['nullable', 'file', 'mimes:jpg,jpeg,png,gif,webp,pdf', 'max:20480'],
        ]);

        $uploaded = [];
        $files = $request->file('files', []);
        if ($request->hasFile('file')) {
            $files[] = $request->file('file');
        }

        foreach ($files as $file) {
            if ($file) {
                $media = $this->mediaService->store($file);
                $uploaded[] = $this->transform($media);
            }
        }

        return response()->json(['message' => 'Fichier(s) téléversé(s).', 'media' => $uploaded], 201);
    }

    public function destroy(CmsMedia $medium): JsonResponse
    {
        $this->mediaService->delete($medium);

        return response()->json(['message' => 'Fichier supprimé.']);
    }

    private function transform(CmsMedia $media): array
    {
        return [
            'id' => $media->id,
            'filename' => $media->filename,
            'path' => $media->path,
            'url' => '/storage/'.$media->path,
            'mime_type' => $media->mime_type,
            'size' => $media->size,
            'size_formatted' => $this->formatBytes($media->size),
            'is_image' => str_starts_with($media->mime_type ?? '', 'image/'),
            'created_at' => $media->created_at,
        ];
    }

    private function formatBytes(?int $bytes): string
    {
        if (! $bytes) {
            return '0 B';
        }

        $units = ['B', 'KB', 'MB', 'GB'];
        $i = (int) floor(log($bytes, 1024));

        return round($bytes / (1024 ** $i), 1).' '.$units[$i];
    }
}
