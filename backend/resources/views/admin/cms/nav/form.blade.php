@extends('layouts.admin')

@php($isEdit = $item->exists)
@section('title', $isEdit ? 'Modifier menu' : 'Nouveau menu')

@section('content')
    <div class="toolbar">
        <h2 class="page-title">{{ $isEdit ? 'Modifier élément menu' : 'Nouvel élément menu' }}</h2>
        <a class="btn btn-outline" href="{{ route('admin.cms.nav.index') }}">← Retour</a>
    </div>

    <form class="card form-grid" method="POST"
          action="{{ $isEdit ? route('admin.cms.nav.update', $item) : route('admin.cms.nav.store') }}">
        @csrf
        @if ($isEdit) @method('PUT') @endif

        <div class="form-row">
            <div>
                <label class="field-label" for="label_fr">Libellé FR *</label>
                <input type="text" id="label_fr" name="label_fr" value="{{ old('label_fr', $item->label['fr'] ?? '') }}" required>
            </div>
            <div>
                <label class="field-label" for="label_en">Libellé EN</label>
                <input type="text" id="label_en" name="label_en" value="{{ old('label_en', $item->label['en'] ?? '') }}">
            </div>
            <div>
                <label class="field-label" for="label_ar">Libellé AR</label>
                <input type="text" id="label_ar" name="label_ar" value="{{ old('label_ar', $item->label['ar'] ?? '') }}">
            </div>
        </div>

        <div class="form-row">
            <div>
                <label class="field-label" for="route">Route / page cible</label>
                <input type="text" id="route" name="route" value="{{ old('route', $item->route ?? 'home') }}" required>
                <p class="help">Ex: home, presentation, fishery, formation/admission, contact</p>
            </div>
            <div>
                <label class="field-label" for="parent_id">Parent (sous-menu)</label>
                <select id="parent_id" name="parent_id">
                    <option value="">— Élément principal —</option>
                    @foreach ($parents as $parent)
                        <option value="{{ $parent->id }}" @selected(old('parent_id', $item->parent_id) == $parent->id)>{{ $parent->labelFor('fr') }}</option>
                    @endforeach
                </select>
            </div>
            <div>
                <label class="field-label" for="sort_order">Ordre</label>
                <input type="number" id="sort_order" name="sort_order" value="{{ old('sort_order', $item->sort_order ?? 0) }}" min="0">
            </div>
        </div>

        <div>
            <label class="field-label">
                <input type="checkbox" name="is_active" value="1" @checked(old('is_active', $item->is_active ?? true))>
                Visible dans le menu
            </label>
        </div>

        <button class="btn btn-primary" type="submit">{{ $isEdit ? 'Enregistrer' : 'Ajouter' }}</button>
    </form>
@endsection
