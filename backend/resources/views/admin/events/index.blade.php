@extends('layouts.admin')

@section('title', 'Événements')

@section('content')
    <div class="toolbar">
        <div>
            <h2 class="page-title">Événements</h2>
            <p class="page-subtitle">Gérez les actualités affichées sur l'accueil et la page événements.</p>
        </div>
        <a class="btn btn-primary" href="{{ route('admin.events.create') }}">+ Nouvel événement</a>
    </div>

    <div class="card">
        @if ($events->isEmpty())
            <p class="empty">Aucun événement CMS. Le site utilise les événements par défaut.</p>
        @else
            <table>
                <thead>
                    <tr>
                        <th>Titre</th>
                        <th>Catégorie</th>
                        <th>Statut</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach ($events as $event)
                        <tr>
                            <td>{{ data_get($event->content, 'fr.title', $event->slug) }}</td>
                            <td>{{ $event->category }}</td>
                            <td><span class="badge {{ $event->is_published ? 'badge-success' : 'badge-draft' }}">{{ $event->is_published ? 'Publié' : 'Brouillon' }}</span></td>
                            <td class="actions">
                                <a href="{{ route('admin.events.edit', $event) }}">Modifier</a>
                                <form method="POST" action="{{ route('admin.events.destroy', $event) }}" onsubmit="return confirm('Supprimer cet événement ?')">
                                    @csrf @method('DELETE')
                                    <button class="btn btn-danger" type="submit">Supprimer</button>
                                </form>
                            </td>
                        </tr>
                    @endforeach
                </tbody>
            </table>
        @endif
    </div>
@endsection
