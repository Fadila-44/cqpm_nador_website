@extends('layouts.admin')

@section('title', 'Message contact')

@section('content')
    <div class="toolbar">
        <h2 class="page-title">Message contact #{{ $contact->id }}</h2>
        <a class="btn btn-outline" href="{{ route('admin.contacts.index') }}">← Retour</a>
    </div>

    <div class="card">
        <div class="detail-grid">
            <div class="detail-item">
                <label>Nom complet</label>
                <p>{{ $contact->full_name }}</p>
            </div>
            <div class="detail-item">
                <label>Email</label>
                <p><a href="mailto:{{ $contact->email }}">{{ $contact->email }}</a></p>
            </div>
            <div class="detail-item">
                <label>Sujet</label>
                <p>{{ $contact->subject }}</p>
            </div>
            <div class="detail-item">
                <label>Reçu le</label>
                <p>{{ $contact->created_at->format('d/m/Y à H:i') }}</p>
            </div>
        </div>

        <div style="margin-top: 1.5rem;">
            <label style="display:block;font-size:0.75rem;color:#64748b;text-transform:uppercase;margin-bottom:0.25rem;">Message</label>
            <div class="message-box">{{ $contact->message }}</div>
        </div>
    </div>
@endsection
