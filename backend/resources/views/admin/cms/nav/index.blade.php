@extends('layouts.admin')

@section('title', 'Menu navbar')

@section('content')
    <div class="toolbar">
        <h2 class="page-title">Menu navbar</h2>
        <div class="actions">
            <a class="btn btn-outline" href="{{ route('admin.cms.pages.index') }}">Pages</a>
            <a class="btn btn-primary" href="{{ route('admin.cms.nav.create') }}">+ Ajouter élément</a>
        </div>
    </div>

    <div class="card">
        <p class="help" style="margin-bottom:1rem;">Les éléments sans parent apparaissent dans la barre principale. Ajoutez un parent pour créer un sous-menu (ex: Formation → Filière Pêche).</p>

        @if ($items->isEmpty())
            <p class="empty">Menu vide. Lancez le seeder ou ajoutez des éléments.</p>
        @else
            <table>
                <thead>
                    <tr>
                        <th>Libellé FR</th>
                        <th>Route</th>
                        <th>Sous-éléments</th>
                        <th>Ordre</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach ($items as $item)
                        <tr>
                            <td><strong>{{ $item->labelFor('fr') }}</strong></td>
                            <td><code>{{ $item->route }}</code></td>
                            <td>
                                @forelse ($item->children as $child)
                                    <div>{{ $child->labelFor('fr') }} → <code>{{ $child->route }}</code></div>
                                @empty
                                    —
                                @endforelse
                            </td>
                            <td>{{ $item->sort_order }}</td>
                            <td class="actions">
                                <a class="btn btn-outline" href="{{ route('admin.cms.nav.edit', $item) }}">Modifier</a>
                                <form method="POST" action="{{ route('admin.cms.nav.destroy', $item) }}" onsubmit="return confirm('Supprimer cet élément et ses sous-menus ?')">
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
