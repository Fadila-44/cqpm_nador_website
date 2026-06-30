@extends('layouts.admin')

@section('title', ($event->exists ? 'Modifier' : 'Créer').' événement')

@section('content')
    <h2 class="page-title">{{ $event->exists ? 'Modifier l\'événement' : 'Nouvel événement' }}</h2>

    <form class="card form-grid" method="POST" action="{{ $event->exists ? route('admin.events.update', $event) : route('admin.events.store') }}" enctype="multipart/form-data">
        @csrf
        @if ($event->exists) @method('PUT') @endif

        <div class="form-row">
            <div>
                <label class="field-label">Slug (identifiant URL)</label>
                <input type="text" name="slug" value="{{ old('slug', $event->slug) }}" required pattern="[a-z0-9\-_]+">
            </div>
            <div>
                <label class="field-label">Catégorie</label>
                <select name="category">
                    @foreach (['Institutionnel','Formation','Atelier','Partenariat','Reconnaissance'] as $cat)
                        <option value="{{ $cat }}" @selected(old('category', $event->category) === $cat)>{{ $cat }}</option>
                    @endforeach
                </select>
            </div>
            <div>
                <label class="field-label">Ordre</label>
                <input type="number" name="sort_order" value="{{ old('sort_order', $event->sort_order ?? 0) }}" min="0">
            </div>
        </div>

        <div class="form-row">
            <div>
                <label class="field-label">Image</label>
                @if ($event->image_path)
                    <img class="thumb" src="{{ asset('storage/'.$event->image_path) }}" alt="">
                @endif
                <input type="file" name="image" accept="image/*" {{ $event->exists ? '' : 'required' }}>
            </div>
            <div>
                <label class="field-label">Icône Material (si pas d'image)</label>
                <input type="text" name="icon" value="{{ old('icon', $event->icon) }}" placeholder="event">
            </div>
        </div>

        @php $fr = $event->content['fr'] ?? []; $en = $event->content['en'] ?? []; $ar = $event->content['ar'] ?? []; @endphp

        <h3>Français</h3>
        <div class="form-row">
            <div><label class="field-label">Date</label><input type="text" name="date_fr" value="{{ old('date_fr', $fr['date'] ?? '') }}"></div>
            <div><label class="field-label">Titre *</label><input type="text" name="title_fr" value="{{ old('title_fr', $fr['title'] ?? '') }}" required></div>
        </div>
        <div><label class="field-label">Texte</label><textarea name="text_fr">{{ old('text_fr', $fr['text'] ?? '') }}</textarea></div>

        <h3>English</h3>
        <div class="form-row">
            <div><label class="field-label">Date</label><input type="text" name="date_en" value="{{ old('date_en', $en['date'] ?? '') }}"></div>
            <div><label class="field-label">Title</label><input type="text" name="title_en" value="{{ old('title_en', $en['title'] ?? '') }}"></div>
        </div>
        <div><label class="field-label">Text</label><textarea name="text_en">{{ old('text_en', $en['text'] ?? '') }}</textarea></div>

        <h3>العربية</h3>
        <div class="form-row">
            <div><label class="field-label">التاريخ</label><input type="text" name="date_ar" value="{{ old('date_ar', $ar['date'] ?? '') }}"></div>
            <div><label class="field-label">العنوان</label><input type="text" name="title_ar" value="{{ old('title_ar', $ar['title'] ?? '') }}"></div>
        </div>
        <div><label class="field-label">النص</label><textarea name="text_ar">{{ old('text_ar', $ar['text'] ?? '') }}</textarea></div>

        <label><input type="checkbox" name="is_published" value="1" {{ old('is_published', $event->is_published ?? true) ? 'checked' : '' }}> Publié</label>

        <div class="actions">
            <button class="btn btn-primary" type="submit">Enregistrer</button>
            <a class="btn btn-outline" href="{{ route('admin.events.index') }}">Retour</a>
        </div>
    </form>
@endsection
