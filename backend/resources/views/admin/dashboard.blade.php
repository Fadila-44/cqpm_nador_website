@extends('layouts.admin')

@section('title', 'Tableau de bord')

@section('content')
    <div class="stats">
        <div class="stat-card stat-card-visitors">
            <div class="stat-icon">👁</div>
            <div class="value">{{ number_format($visitorsCount) }}</div>
            <div class="label">Visiteurs totaux</div>
        </div>
        <div class="stat-card stat-card-today">
            <div class="stat-icon">📅</div>
            <div class="value">{{ number_format($visitorsToday) }}</div>
            <div class="label">Visiteurs aujourd'hui</div>
        </div>
        <div class="stat-card stat-card-events">
            <div class="stat-icon">📅</div>
            <div class="value">{{ number_format($eventsCount) }}</div>
            <div class="label">Événements</div>
        </div>
        <div class="stat-card stat-card-gallery">
            <div class="stat-icon">🖼</div>
            <div class="value">{{ number_format($galleryCount) }}</div>
            <div class="label">Photos galerie</div>
        </div>
        <div class="stat-card stat-card-contacts">
            <div class="stat-icon">✉</div>
            <div class="value">{{ number_format($contactsCount) }}</div>
            <div class="label">Messages</div>
        </div>
        <div class="stat-card stat-card-registrations">
            <div class="stat-icon">📝</div>
            <div class="value">{{ number_format($registrationsCount) }}</div>
            <div class="label">Inscriptions</div>
        </div>
    </div>

    <div class="actions" style="margin-bottom:1.25rem; gap:0.75rem;">
        <a class="btn btn-primary" href="{{ route('admin.events.create') }}">+ Nouvel événement</a>
        <a class="btn btn-outline" href="{{ route('admin.gallery.create') }}">+ Photo galerie</a>
        <a class="btn btn-outline" href="/" target="_blank" rel="noopener">Voir le site</a>
    </div>

    <div class="card">
        <div class="toolbar">
            <h3>Événements récents</h3>
            <a class="btn btn-outline" href="{{ route('admin.events.index') }}">Voir tout →</a>
        </div>
        @if ($recentEvents->isEmpty())
            <p class="empty">Aucun événement CMS. Les événements par défaut du site restent visibles.</p>
        @else
            @foreach ($recentEvents as $event)
                <div class="list-row">
                    <div>
                        <strong>{{ data_get($event->content, 'fr.title', $event->slug) }}</strong>
                        <div class="list-row-meta">{{ $event->category }} · {{ $event->created_at->format('d/m/Y') }}</div>
                    </div>
                    <div class="actions">
                        <span class="badge {{ $event->is_published ? 'badge-success' : 'badge-draft' }}">{{ $event->is_published ? 'Publié' : 'Brouillon' }}</span>
                        <a href="{{ route('admin.events.edit', $event) }}">Modifier</a>
                    </div>
                </div>
            @endforeach
        @endif
    </div>

    <div class="card">
        <div class="toolbar">
            <h3>Derniers messages</h3>
            <a class="btn btn-outline" href="{{ route('admin.contacts.index') }}">Voir tout →</a>
        </div>
        @if ($recentContacts->isEmpty())
            <p class="empty">Aucun message pour le moment.</p>
        @else
            @foreach ($recentContacts as $contact)
                <div class="list-row">
                    <div>
                        <strong><a href="{{ route('admin.contacts.show', $contact) }}">{{ $contact->full_name }}</a></strong>
                        <div class="list-row-meta">{{ $contact->subject }} · {{ $contact->created_at->format('d/m/Y H:i') }}</div>
                    </div>
                </div>
            @endforeach
        @endif
    </div>

    <div class="card">
        <div class="toolbar">
            <h3>Dernières inscriptions</h3>
            <a class="btn btn-outline" href="{{ route('admin.registrations.index') }}">Voir tout →</a>
        </div>
        @if ($recentRegistrations->isEmpty())
            <p class="empty">Aucune inscription pour le moment.</p>
        @else
            @foreach ($recentRegistrations as $registration)
                <div class="list-row">
                    <div>
                        <strong><a href="{{ route('admin.registrations.show', $registration) }}">{{ $registration->first_name }} {{ $registration->last_name }}</a></strong>
                        <div class="list-row-meta">{{ $registration->training_type }} · {{ $registration->created_at->format('d/m/Y H:i') }}</div>
                    </div>
                </div>
            @endforeach
        @endif
    </div>
@endsection
