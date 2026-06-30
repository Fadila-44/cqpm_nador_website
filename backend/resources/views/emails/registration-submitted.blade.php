<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Confirmation d'inscription</title>
</head>
<body style="font-family:Segoe UI,sans-serif;color:#1a2b3c;line-height:1.6;">
    <h2>Confirmation d'inscription - CQPM Nador</h2>
    <p>Bonjour {{ $registration->first_name }} {{ $registration->last_name }},</p>
    <p>Nous vous confirmons la bonne réception de votre dossier de candidature au CQPM Nador. Votre inscription est <strong>enregistrée avec succès</strong>.</p>

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
            <td style="padding:8px 0;font-weight:bold;">Téléphone</td>
            <td style="padding:8px 0;">{{ $registration->country_code }} {{ $registration->phone }}</td>
        </tr>
        <tr>
            <td style="padding:8px 0;font-weight:bold;">Reçu le</td>
            <td style="padding:8px 0;">{{ $registration->created_at->format('d/m/Y H:i') }}</td>
        </tr>
    </table>

    <p style="margin-top:24px;">Notre équipe vous contactera prochainement pour la suite du processus (convocation, pièces complémentaires, etc.).</p>

    <p style="margin-top:24px;color:#64748b;font-size:14px;">
        Centre de Qualification Professionnelle Maritime de Nador<br>
        Tél : 05 36 60 87 27 / 05 36 60 87 28<br>
        Email : cqpmnador@gmail.com
    </p>
</body>
</html>