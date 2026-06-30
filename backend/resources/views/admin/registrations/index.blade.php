@extends('layouts.admin')

@section('title', 'Inscriptions')

@section('content')
    <div class="toolbar">
        <h2 class="page-title">Inscriptions</h2>
        <span class="badge">{{ $registrations->total() }} total</span>
    </div>

    <div class="card">
        @if ($registrations->isEmpty())
            <p class="empty">Aucune inscription reçue.</p>
        @else
            <table>
                <thead>
                    <tr>
                        <th>Candidat</th>
                        <th>Email</th>
                        <th>Formation</th>
                        <th>Téléphone</th>
                        <th>Date</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach ($registrations as $registration)
                        <tr>
                            <td><a href="{{ route('admin.registrations.show', $registration) }}">{{ $registration->first_name }} {{ $registration->last_name }}</a></td>
                            <td>{{ $registration->email }}</td>
                            <td>{{ $registration->training_type }}</td>
                            <td>{{ $registration->country_code }} {{ $registration->phone }}</td>
                            <td>{{ $registration->created_at->format('d/m/Y H:i') }}</td>
                        </tr>
                    @endforeach
                </tbody>
            </table>
            <div class="pagination">{{ $registrations->links() }}</div>
        @endif
    </div>
@endsection
