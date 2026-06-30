@extends('layouts.admin')

@section('title', 'Galerie')

@section('content')
    <div class="toolbar">
        <div>
            <h2 class="page-title">Galerie</h2>
            <p class="page-subtitle">Photos par section : Formation, Compus, Activités.</p>
        </div>
        <a class="btn btn-primary" href="{{ route('admin.gallery.create') }}">+ Ajouter une photo</a>
    </div>

    <div class="card">
        @if ($items->isEmpty())
            <p class="empty">Aucune photo. Le site utilise les images par défaut.</p>
        @else
            <table>
                <thead>
                    <tr><th>Photo</th><th>Titre</th><th>Section</th><th>Actions</th></tr>
                </thead>
                <tbody>
                    @foreach ($items as $item)
                        <tr>
                            <td><img class="thumb" src="{{ asset('storage/'.$item->image_path) }}" alt=""></td>
                            <td>{{ data_get($item->title, 'fr', '—') }}</td>
                            <td>{{ $item->category }}</td>
                            <td class="actions">
                                <a href="{{ route('admin.gallery.edit', $item) }}">Modifier</a>
                                <form method="POST" action="{{ route('admin.gallery.destroy', $item) }}" onsubmit="return confirm('Supprimer cette photo ?')">
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
