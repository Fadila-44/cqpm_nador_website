@extends('layouts.admin')

@section('title', ($item->exists ? 'Modifier' : 'Ajouter').' photo')

@section('content')
    <h2 class="page-title">{{ $item->exists ? 'Modifier la photo' : 'Ajouter une photo' }}</h2>

    <form class="card form-grid" method="POST" action="{{ $item->exists ? route('admin.gallery.update', $item) : route('admin.gallery.store') }}" enctype="multipart/form-data">
        @csrf
        @if ($item->exists) @method('PUT') @endif

        <div class="form-row">
            <div>
                <label class="field-label">Section (filtre)</label>
                <select name="category" required>
                    @foreach (['Formation', 'Compus', 'Activités'] as $cat)
                        <option value="{{ $cat }}" @selected(old('category', $item->category) === $cat)>{{ $cat }}</option>
                    @endforeach
                </select>
            </div>
            <div>
                <label class="field-label">Ordre</label>
                <input type="number" name="sort_order" value="{{ old('sort_order', $item->sort_order ?? 0) }}" min="0">
            </div>
        </div>

        <div>
            <label class="field-label">Image</label>
            @if ($item->image_path)
                <img class="thumb" src="{{ asset('storage/'.$item->image_path) }}" alt="">
            @endif
            <input type="file" name="image" accept="image/*" {{ $item->exists ? '' : 'required' }}>
        </div>

        <div class="form-row">
            <div><label class="field-label">Titre FR *</label><input type="text" name="title_fr" value="{{ old('title_fr', $item->title['fr'] ?? '') }}" required></div>
            <div><label class="field-label">Titre EN</label><input type="text" name="title_en" value="{{ old('title_en', $item->title['en'] ?? '') }}"></div>
            <div><label class="field-label">Titre AR</label><input type="text" name="title_ar" value="{{ old('title_ar', $item->title['ar'] ?? '') }}"></div>
        </div>

        <label><input type="checkbox" name="is_featured" value="1" {{ old('is_featured', $item->is_featured) ? 'checked' : '' }}> Mise en avant</label>
        <label><input type="checkbox" name="is_wide" value="1" {{ old('is_wide', $item->is_wide) ? 'checked' : '' }}> Format large</label>
        <label><input type="checkbox" name="is_published" value="1" {{ old('is_published', $item->is_published ?? true) ? 'checked' : '' }}> Publié</label>

        <div class="actions">
            <button class="btn btn-primary" type="submit">Enregistrer</button>
            <a class="btn btn-outline" href="{{ route('admin.gallery.index') }}">Retour</a>
        </div>
    </form>
@endsection
