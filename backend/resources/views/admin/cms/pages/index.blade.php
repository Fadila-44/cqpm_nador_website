@extends('layouts.admin')

@section('title', 'Pages du site')

@section('content')
    <div class="toolbar">
        <h2 class="page-title">Pages du site</h2>
        <div class="actions">
            <a class="btn btn-outline" href="{{ route('admin.cms.slides.index') }}">Slides hero</a>
            <a class="btn btn-outline" href="{{ route('admin.cms.nav.index') }}">Menu navbar</a>
            <a class="btn btn-outline" href="{{ route('admin.cms.media.index') }}">Médias</a>
            <a class="btn btn-primary" href="{{ route('admin.cms.pages.create') }}">+ Nouvelle page</a>
        </div>
    </div>

    <div class="card">
        @if ($pages->isEmpty())
            <p class="empty">Aucune page. Créez une page ou lancez <code>php artisan db:seed --class=CmsSeeder</code>.</p>
        @else
            <table>
                <thead>
                    <tr>
                        <th>Slug / Route</th>
                        <th>Titre (FR)</th>
                        <th>Template</th>
                        <th>Statut</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach ($pages as $page)
                        <tr>
                            <td><code>{{ $page->slug }}</code></td>
                            <td>{{ $page->localized('fr', 'title', '—') }}</td>
                            <td>{{ $page->template }}</td>
                            <td>{{ $page->is_published ? 'Publié' : 'Brouillon' }}</td>
                            <td class="actions">
                                <a class="btn btn-outline" href="{{ route('admin.cms.pages.edit', $page) }}">Modifier</a>
                                <form method="POST" action="{{ route('admin.cms.pages.destroy', $page) }}" onsubmit="return confirm('Supprimer cette page ?')">
                                    @csrf
                                    @method('DELETE')
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
