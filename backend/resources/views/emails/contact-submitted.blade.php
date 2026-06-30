<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Confirmation d'inscription</title>
</head>
<body style="font-family:Segoe UI,sans-serif;color:#1a2b3c;line-height:1.6;">
    <h2>Confirmation d'inscription - CQPM Nador</h2>
    <p>Bonjour {{ $registration->first_name }} {{ $registration->last_name }},</p>
    <p>Nous avons bien reçu votre candidature pour la formation au CQPM Nador.</p>

    <table style="border-collapse:collapse;width:100%;max-width:600px;">
        <tr>
            <td style="padding:8px 0;font-weight:bold;width:140px;">Type de formation</td>
            <td style="padding:8px 0;">{{ $registration->training_type }}</td>
        </tr>
        <tr>
            <td style="padding:8px 0;font-weight:bold;">Section</td>
            <td style="padding:8px 0;">{{ $registration->section }}</td>
        </tr>
        <tr>
            <td style="padding:8px 0;font-weight:bold;">Email</td>
            <td style="padding:8px 0;">{{ $registration->email }}</td>
        </tr>
        <tr>
            <td style="padding:8px 0;font-weight:bold;">Téléphone</td>
            <td style="padding:8px 0;">{{ $registration->country_code }} {{ $registration->phone }}</td>
        </tr>
        <tr>
            <td style="padding:8px 0;font-weight:bold;vertical-align:top;">Date de naissance</td>
            <td style="padding:8px 0;">{{ $registration->birth_date ? \Carbon\Carbon::parse($registration->birth_date)->format('d/m/Y') : 'Non précisée' }}</td>
        </tr>
        <tr>
            <td style="padding:8px 0;font-weight:bold;">Reçu le</td>
            <td style="padding:8px 0;">{{ $registration->created_at->format('d/m/Y H:i') }}</td>
        </tr>
    </table>

    <p style="margin-top:24px;">Nous vous remercions de votre confiance. Notre équipe vous contactera prochainement pour la suite du processus.</p>

    <p style="margin-top:24px;color:#64748b;font-size:14px;">
        Centre de Qualification Professionnelle Maritime de Nador<br>
        Tél : 05 36 60 87 27 / 05 36 60 87 28<br>
        Email : cqpmnador@gmail.com
    </p>
</body>
</html>