@extends('layouts.admin')

@section('title', 'Slides hero')

@section('content')
    <div class="toolbar">
        <h2 class="page-title">Slides hero (accueil)</h2>
        <div class="actions">
            <a class="btn btn-outline" href="{{ route('admin.cms.pages.index') }}">Pages</a>
            <a class="btn btn-primary" href="{{ route('admin.cms.slides.create') }}">+ Ajouter slide</a>
        </div>
    </div>

    <div class="card">
        @if ($slides->isEmpty())
            <p class="empty">Aucune slide. Ajoutez des images pour le carousel de la page d'accueil.</p>
        @else
            <table>
                <thead>
                    <tr>
                        <th>Aperçu</th>
                        <th>Alt (FR)</th>
                        <th>Ordre</th>
                        <th>Actif</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach ($slides as $slide)
                        <tr>
                            <td><img class="thumb" src="{{ url('storage/'.$slide->image_path) }}" alt=""></td>
                            <td>{{ $slide->altFor('fr') }}</td>
                            <td>{{ $slide->sort_order }}</td>
                            <td>{{ $slide->is_active ? 'Oui' : 'Non' }}</td>
                            <td class="actions">
                                <a class="btn btn-outline" href="{{ route('admin.cms.slides.edit', $slide) }}">Modifier</a>
                                <form method="POST" action="{{ route('admin.cms.slides.destroy', $slide) }}" onsubmit="return confirm('Supprimer ?')">
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
