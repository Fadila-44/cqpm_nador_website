@extends('layouts.admin')

@section('title', 'Inscription')

@section('content')
    <div class="toolbar">
        <h2 class="page-title">Inscription #{{ $registration->id }}</h2>
        <a class="btn btn-outline" href="{{ route('admin.registrations.index') }}">← Retour</a>
    </div>

    <div class="card">
        <h3 style="margin-bottom:1rem;">Formation</h3>
        <div class="detail-grid">
            <div class="detail-item">
                <label>Type de formation</label>
                <p>{{ $registration->training_type }}</p>
            </div>
            <div class="detail-item">
                <label>Section</label>
                <p>{{ $registration->section }}</p>
            </div>
        </div>
    </div>

    <div class="card">
        <h3 style="margin-bottom:1rem;">Informations personnelles</h3>
        <div class="detail-grid">
            <div class="detail-item">
                <label>Nom</label>
                <p>{{ $registration->last_name }}</p>
            </div>
            <div class="detail-item">
                <label>Prénom</label>
                <p>{{ $registration->first_name }}</p>
            </div>
            <div class="detail-item">
                <label>Genre</label>
                <p>{{ $registration->gender }}</p>
            </div>
            <div class="detail-item">
                <label>Email</label>
                <p><a href="mailto:{{ $registration->email }}">{{ $registration->email }}</a></p>
            </div>
            <div class="detail-item">
                <label>Téléphone</label>
                <p>{{ $registration->country_code }} {{ $registration->phone }}</p>
            </div>
            <div class="detail-item">
                <label>Lieu de naissance</label>
                <p>{{ $registration->birth_place }}</p>
            </div>
            <div class="detail-item">
                <label>Date de naissance</label>
                <p>{{ $registration->birth_date->format('d/m/Y') }}</p>
            </div>
            <div class="detail-item">
                <label>Niveau d'études</label>
                <p>{{ $registration->education }}</p>
            </div>
        </div>
    </div>

    <div class="card">
        <h3 style="margin-bottom:1rem;">Adresse</h3>
        <div class="detail-grid">
            <div class="detail-item">
                <label>Région</label>
                <p>{{ $registration->region }}</p>
            </div>
            <div class="detail-item">
                <label>Ville</label>
                <p>{{ $registration->city }}</p>
            </div>
            <div class="detail-item" style="grid-column: 1 / -1;">
                <label>Adresse complète</label>
                <p>{{ $registration->address }}</p>
            </div>
            <div class="detail-item">
                <label>Inscrit le</label>
                <p>{{ $registration->created_at->format('d/m/Y à H:i') }}</p>
            </div>
        </div>
    </div>
@endsection
