@extends('layouts.admin')

@section('title', 'Messages contact')

@section('content')
    <div class="toolbar">
        <h2 class="page-title">Messages contact</h2>
        <span class="badge">{{ $contacts->total() }} total</span>
    </div>

    <div class="card">
        @if ($contacts->isEmpty())
            <p class="empty">Aucun message reçu.</p>
        @else
            <table>
                <thead>
                    <tr>
                        <th>Nom</th>
                        <th>Email</th>
                        <th>Sujet</th>
                        <th>Date</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach ($contacts as $contact)
                        <tr>
                            <td><a href="{{ route('admin.contacts.show', $contact) }}">{{ $contact->full_name }}</a></td>
                            <td>{{ $contact->email }}</td>
                            <td>{{ $contact->subject }}</td>
                            <td>{{ $contact->created_at->format('d/m/Y H:i') }}</td>
                        </tr>
                    @endforeach
                </tbody>
            </table>
            <div class="pagination">{{ $contacts->links() }}</div>
        @endif
    </div>
@endsection
