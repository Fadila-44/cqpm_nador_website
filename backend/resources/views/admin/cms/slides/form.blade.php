@extends('layouts.admin')

@php($isEdit = $slide->exists)
@section('title', $isEdit ? 'Modifier slide' : 'Nouvelle slide')

@section('content')
    <div class="toolbar">
        <h2 class="page-title">{{ $isEdit ? 'Modifier slide' : 'Nouvelle slide hero' }}</h2>
        <a class="btn btn-outline" href="{{ route('admin.cms.slides.index') }}">← Retour</a>
    </div>

    <form class="card form-grid" method="POST" enctype="multipart/form-data"
          action="{{ $isEdit ? route('admin.cms.slides.update', $slide) : route('admin.cms.slides.store') }}">
        @csrf
        @if ($isEdit) @method('PUT') @endif

        <div>
            <label class="field-label" for="image">Image {{ $isEdit ? '(laisser vide pour conserver)' : '' }}</label>
            <input type="file" id="image" name="image" accept="image/*" {{ $isEdit ? '' : 'required' }}>
            @if ($isEdit && $slide->image_path)
                <img class="thumb" src="{{ url('storage/'.$slide->image_path) }}" alt="">
            @endif
        </div>

        <div class="form-row">
            <div>
                <label class="field-label" for="alt_fr">Texte alternatif FR</label>
                <input type="text" id="alt_fr" name="alt_fr" value="{{ old('alt_fr', $slide->alt['fr'] ?? '') }}">
            </div>
            <div>
                <label class="field-label" for="alt_en">Alt EN</label>
                <input type="text" id="alt_en" name="alt_en" value="{{ old('alt_en', $slide->alt['en'] ?? '') }}">
            </div>
            <div>
                <label class="field-label" for="alt_ar">Alt AR</label>
                <input type="text" id="alt_ar" name="alt_ar" value="{{ old('alt_ar', $slide->alt['ar'] ?? '') }}">
            </div>
        </div>

        <div class="form-row">
            <div>
                <label class="field-label" for="page_slug">Page associée</label>
                <select id="page_slug" name="page_slug" required>
                    @foreach (array_merge(['home' => 'Accueil'], config('site_sections', [])) as $slug => $label)
                        <option value="{{ $slug }}" @selected(old('page_slug', $slide->page_slug ?? 'home') === $slug)>{{ $label }}</option>
                    @endforeach
                </select>
                <p class="help">Slides affichés sur la page choisie (accueil = carousel principal).</p>
            </div>
            <div>
                <label class="field-label" for="sort_order">Ordre</label>
                <input type="number" id="sort_order" name="sort_order" value="{{ old('sort_order', $slide->sort_order ?? 0) }}" min="0">
            </div>
            <div>
                <label class="field-label">
                    <input type="checkbox" name="is_active" value="1" @checked(old('is_active', $slide->is_active ?? true))>
                    Active
                </label>
            </div>
        </div>

        <button class="btn btn-primary" type="submit">{{ $isEdit ? 'Enregistrer' : 'Ajouter' }}</button>
    </form>
@endsection
