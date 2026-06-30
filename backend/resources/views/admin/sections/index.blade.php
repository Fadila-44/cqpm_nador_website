@extends('layouts.admin')

@section('title', 'Sections du site')

@section('content')
    <h2 class="page-title">Sections du site</h2>
    <p class="page-subtitle">Modifiez le contenu de chaque page : textes, photos, PDF et sections.</p>

    <div class="card">
        @foreach ($sections as $section)
            <div class="list-row">
                <div>
                    <strong>{{ $section->label }}</strong>
                    <div class="list-row-meta">Clé : {{ $section->key }}</div>
                </div>
                <div class="actions">
                    <span class="badge {{ $section->is_published ? 'badge-success' : 'badge-draft' }}">{{ $section->is_published ? 'Publié' : 'Brouillon' }}</span>
                    <a class="btn btn-outline" href="{{ route('admin.sections.edit', $section->key) }}">Modifier</a>
                </div>
            </div>
        @endforeach
    </div>
@endsection
