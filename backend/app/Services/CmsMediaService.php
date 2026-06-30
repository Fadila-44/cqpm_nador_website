<?php

namespace App\Services;

use App\Models\CmsMedia;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class CmsMediaService
{
    public function store(UploadedFile $file, ?array $alt = null): CmsMedia
    {
        $folder = $this->folderFor($file);
        $filename = Str::uuid()->toString().'.'.$file->getClientOriginalExtension();
        $path = $file->storeAs($folder, $filename, 'public');

        return CmsMedia::create([
            'filename' => $filename,
            'original_name' => $file->getClientOriginalName(),
            'path' => $path,
            'mime_type' => $file->getMimeType() ?? 'application/octet-stream',
            'size' => $file->getSize() ?? 0,
            'alt' => $alt,
        ]);
    }

    public function delete(CmsMedia $media): void
    {
        Storage::disk('public')->delete($media->path);
        $media->delete();
    }

    private function folderFor(UploadedFile $file): string
    {
        $mime = $file->getMimeType() ?? '';

        if (str_starts_with($mime, 'image/')) {
            return 'cms/images';
        }

        if ($mime === 'application/pdf') {
            return 'cms/pdfs';
        }

        return 'cms/files';
    }
}
