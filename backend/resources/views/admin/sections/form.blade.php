@extends('layouts.admin')

@section('title', 'Modifier — '.$section->label)

@section('content')
    <h2 class="page-title">{{ $section->label }}</h2>
    <p class="page-subtitle">Textes multilingues, image hero et document PDF pour cette page.</p>

    <form class="card form-grid" method="POST" action="{{ route('admin.sections.update', $section->key) }}" enctype="multipart/form-data">
        @csrf
        @method('PUT')

        <label><input type="checkbox" name="is_published" value="1" {{ old('is_published', $section->is_published) ? 'checked' : '' }}> Publié</label>

        <div class="form-row">
            <div>
                <label class="field-label">Image hero</label>
                @if ($section->hero_image)
                    <img class="thumb" src="{{ asset('storage/'.$section->hero_image) }}" alt="">
                @endif
                <input type="file" name="hero_image_file" accept="image/*">
            </div>
            <div>
                <label class="field-label">Document PDF (optionnel)</label>
                <input type="file" name="pdf_file" accept="application/pdf">
            </div>
        </div>

        @php $fr = $section->content['fr'] ?? []; $en = $section->content['en'] ?? []; $ar = $section->content['ar'] ?? []; @endphp

        <div class="tabs" data-tabs>
            <button type="button" class="tab-btn active" data-tab="fr">Français</button>
            <button type="button" class="tab-btn" data-tab="en">English</button>
            <button type="button" class="tab-btn" data-tab="ar">العربية</button>
        </div>

        @foreach (['fr' => $fr, 'en' => $en, 'ar' => $ar] as $lang => $data)
            <div class="tab-panel {{ $lang === 'fr' ? 'active' : '' }}" data-panel="{{ $lang }}">
                <div class="form-grid">
                    <div>
                        <label class="field-label">Surtitre (eyebrow)</label>
                        <input type="text" name="eyebrow_{{ $lang }}" value="{{ old('eyebrow_'.$lang, $data['eyebrow'] ?? '') }}">
                    </div>
                    <div>
                        <label class="field-label">Titre</label>
                        <input type="text" name="title_{{ $lang }}" value="{{ old('title_'.$lang, $data['title'] ?? '') }}">
                    </div>
                    <div>
                        <label class="field-label">Introduction</label>
                        <textarea name="intro_{{ $lang }}">{{ old('intro_'.$lang, $data['intro'] ?? '') }}</textarea>
                    </div>
                    <div>
                        <label class="field-label">Contenu / paragraphes</label>
                        <textarea name="body_{{ $lang }}" rows="8">{{ old('body_'.$lang, $data['body'] ?? '') }}</textarea>
                    </div>
                </div>
            </div>
        @endforeach

        <div>
            <label class="field-label">Contenu avancé (JSON)</label>
            <textarea name="content_json" rows="10" placeholder='{"fr":{"missions":[...]},"sections":[...]}'>{{ old('content_json', json_encode($section->content, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE)) }}</textarea>
            <p class="help">Pour missions, objectifs, partenaires, modules filière, etc. Laissez vide pour conserver uniquement les champs ci-dessus.</p>
        </div>

        <div class="actions">
            <button class="btn btn-primary" type="submit">Enregistrer</button>
            <a class="btn btn-outline" href="{{ route('admin.sections.index') }}">Retour</a>
        </div>
    </form>
@endsection

@push('scripts')
<script>
document.querySelectorAll('[data-tabs]').forEach((tabs) => {
    const buttons = tabs.querySelectorAll('.tab-btn');
    const panels = tabs.parentElement.querySelectorAll('[data-panel]');
    buttons.forEach((btn) => {
        btn.addEventListener('click', () => {
            buttons.forEach((b) => b.classList.remove('active'));
            panels.forEach((p) => p.classList.remove('active'));
            btn.classList.add('active');
            tabs.parentElement.querySelector(`[data-panel="${btn.dataset.tab}"]`)?.classList.add('active');
        });
    });
});
</script>
@endpush
