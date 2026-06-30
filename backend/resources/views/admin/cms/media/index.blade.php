@extends('layouts.admin')

@section('title', 'Bibliothèque médias')

@section('content')
    <div class="toolbar">
        <h2 class="page-title">Bibliothèque médias</h2>
        <a class="btn btn-outline" href="{{ route('admin.cms.pages.index') }}">Pages</a>
    </div>

    <form class="card form-grid" method="POST" action="{{ route('admin.cms.media.store') }}" enctype="multipart/form-data">
        @csrf
        <div>
            <label class="field-label" for="files">Téléverser images ou PDF</label>
            <input type="file" id="files" name="files[]" accept="image/*,application/pdf" multiple required>
        </div>
        <button class="btn btn-primary" type="submit">Téléverser</button>
    </form>

    <div class="card" style="margin-top:1rem;">
        <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:1rem;">
            @forelse ($media as $file)
                <div style="border:1px solid var(--border);border-radius:8px;padding:0.75rem;">
                    @if ($file->isImage())
                        <img class="thumb" style="width:100%;max-width:none;" src="{{ $file->url() }}" alt="">
                    @else
                        <div style="padding:2rem 0;text-align:center;background:#f8fafc;border-radius:8px;">PDF</div>
                    @endif
                    <p style="font-size:0.75rem;margin:0.5rem 0;word-break:break-all;">{{ $file->original_name }}</p>
                    <code style="font-size:0.7rem;display:block;margin-bottom:0.5rem;">{{ $file->path }}</code>
                    <form method="POST" action="{{ route('admin.cms.media.destroy', $file) }}" onsubmit="return confirm('Supprimer ?')">
                        @csrf @method('DELETE')
                        <button class="btn btn-danger" type="submit">Supprimer</button>
                    </form>
                </div>
            @empty
                <p class="empty">Aucun fichier.</p>
            @endforelse
        </div>
        <div class="pagination">{{ $media->links() }}</div>
    </div>
@endsection
