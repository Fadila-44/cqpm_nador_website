@extends('layouts.admin')

@php($isEdit = $page->exists)
@section('title', $isEdit ? 'Modifier page' : 'Nouvelle page')

@section('content')
    <div class="toolbar">
        <h2 class="page-title">{{ $isEdit ? 'Modifier la page' : 'Nouvelle page' }}</h2>
        <a class="btn btn-outline" href="{{ route('admin.cms.pages.index') }}">← Retour</a>
    </div>

    <form class="card form-grid" method="POST" enctype="multipart/form-data"
          action="{{ $isEdit ? route('admin.cms.pages.update', $page) : route('admin.cms.pages.store') }}">
        @csrf
        @if ($isEdit) @method('PUT') @endif

        <div class="form-row">
            <div>
                <label class="field-label" for="slug">Slug / route (ex: presentation, formation/admission)</label>
                <input type="text" id="slug" name="slug" value="{{ old('slug', $page->slug) }}" required>
                <p class="help">Utilisé dans l'URL : #slug</p>
            </div>
            <div>
                <label class="field-label" for="template">Modèle</label>
                <select id="template" name="template">
                    @foreach (['standard' => 'Standard', 'document' => 'Document PDF', 'gallery' => 'Galerie'] as $value => $label)
                        <option value="{{ $value }}" @selected(old('template', $page->template) === $value)>{{ $label }}</option>
                    @endforeach
                </select>
            </div>
            <div>
                <label class="field-label" for="sort_order">Ordre</label>
                <input type="number" id="sort_order" name="sort_order" value="{{ old('sort_order', $page->sort_order ?? 0) }}" min="0">
            </div>
        </div>

        <div class="form-row">
            <div>
                <label class="field-label" for="hero_image_file">Image hero (optionnel)</label>
                <input type="file" id="hero_image_file" name="hero_image_file" accept="image/*">
                @if ($page->hero_image)
                    <p class="help">Actuelle : {{ $page->hero_image }}</p>
                    <img class="thumb" src="{{ url('storage/'.$page->hero_image) }}" alt="">
                @endif
            </div>
            <div>
                <label class="field-label">
                    <input type="checkbox" name="is_published" value="1" @checked(old('is_published', $page->is_published ?? true))>
                    Publié
                </label>
            </div>
        </div>

        <div class="tabs" role="tablist">
            @foreach (['fr' => 'Français', 'en' => 'English', 'ar' => 'العربية'] as $code => $label)
                <button type="button" class="tab-btn {{ $loop->first ? 'active' : '' }}" data-tab="{{ $code }}">{{ $label }}</button>
            @endforeach
        </div>

        @foreach (['fr', 'en', 'ar'] as $lang)
            @php($locale = $page->content[$lang] ?? [])
            <div class="tab-panel {{ $lang === 'fr' ? 'active' : '' }}" data-panel="{{ $lang }}">
                <div class="form-grid">
                    <div>
                        <label class="field-label" for="eyebrow_{{ $lang }}">Surtitre</label>
                        <input type="text" id="eyebrow_{{ $lang }}" name="eyebrow_{{ $lang }}" value="{{ old('eyebrow_'.$lang, $locale['eyebrow'] ?? '') }}">
                    </div>
                    <div>
                        <label class="field-label" for="title_{{ $lang }}">Titre</label>
                        <input type="text" id="title_{{ $lang }}" name="title_{{ $lang }}" value="{{ old('title_'.$lang, $locale['title'] ?? '') }}">
                    </div>
                    <div>
                        <label class="field-label" for="intro_{{ $lang }}">Introduction</label>
                        <textarea id="intro_{{ $lang }}" name="intro_{{ $lang }}">{{ old('intro_'.$lang, $locale['intro'] ?? '') }}</textarea>
                    </div>
                    <div>
                        <label class="field-label" for="body_{{ $lang }}">Contenu principal</label>
                        <textarea id="body_{{ $lang }}" name="body_{{ $lang }}" style="min-height:200px;">{{ old('body_'.$lang, $locale['body'] ?? '') }}</textarea>
                    </div>
                    <div>
                        <label class="field-label" for="pdf_{{ $lang }}">PDF (document)</label>
                        <input type="file" id="pdf_{{ $lang }}" name="pdf_{{ $lang }}" accept="application/pdf">
                        @if (!empty($locale['pdf']))
                            <p class="help">PDF actuel : {{ $locale['pdf'] }}</p>
                        @endif
                    </div>
                    <div>
                        <label class="field-label" for="gallery_{{ $lang }}">Images galerie</label>
                        <input type="file" id="gallery_{{ $lang }}" name="gallery_{{ $lang }}[]" accept="image/*" multiple>
                    </div>
                    <div>
                        <label class="field-label" for="sections_{{ $lang }}">Sections avancées (JSON)</label>
                        <textarea id="sections_{{ $lang }}" name="sections_{{ $lang }}" style="min-height:160px;font-family:monospace;">{{ old('sections_'.$lang, isset($locale['sections']) ? json_encode($locale['sections'], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE) : '') }}</textarea>
                        <p class="help">Ex: [{"type":"text","heading":"Titre","body":"..."},{"type":"image","url":"cms/images/..."}]</p>
                    </div>
                </div>
            </div>
        @endforeach

        <div class="actions">
            <button class="btn btn-primary" type="submit">{{ $isEdit ? 'Enregistrer' : 'Créer la page' }}</button>
        </div>
    </form>
@endsection

@push('scripts')
<script>
document.querySelectorAll('.tab-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.tab-btn').forEach((b) => b.classList.remove('active'));
        document.querySelectorAll('.tab-panel').forEach((p) => p.classList.remove('active'));
        btn.classList.add('active');
        document.querySelector(`[data-panel="${btn.dataset.tab}"]`).classList.add('active');
    });
});
</script>
@endpush
