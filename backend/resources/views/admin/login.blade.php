<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Connexion — CQPM Admin</title>
    <style>
        body {
            margin: 0;
            min-height: 100vh;
            display: grid;
            place-items: center;
            font-family: "Segoe UI", system-ui, sans-serif;
            background: linear-gradient(135deg, #0b5cab, #094a8a);
            color: #1a2b3c;
        }
        .login-card {
            width: min(420px, calc(100% - 2rem));
            background: #fff;
            border-radius: 12px;
            padding: 2rem;
            box-shadow: 0 20px 40px rgba(0,0,0,0.15);
        }
        h1 { font-size: 1.4rem; margin-bottom: 0.25rem; }
        p { color: #64748b; margin-bottom: 1.5rem; }
        label { display: block; font-size: 0.85rem; margin-bottom: 0.35rem; font-weight: 600; }
        input[type="email"], input[type="password"] {
            width: 100%;
            padding: 0.7rem 0.85rem;
            border: 1px solid #cbd5e1;
            border-radius: 8px;
            margin-bottom: 1rem;
            font-size: 1rem;
        }
        .remember { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1rem; font-size: 0.9rem; }
        button {
            width: 100%;
            padding: 0.75rem;
            border: none;
            border-radius: 8px;
            background: #0b5cab;
            color: #fff;
            font-size: 1rem;
            font-weight: 600;
            cursor: pointer;
        }
        button:hover { background: #094a8a; }
        .error { background: #fef2f2; color: #b91c1c; padding: 0.75rem; border-radius: 8px; margin-bottom: 1rem; font-size: 0.9rem; }
    </style>
</head>
<body>
    <div class="login-card">
        <h1>Administration CQPM</h1>
        <p>Connectez-vous pour consulter les soumissions.</p>

        @if ($errors->any())
            <div class="error">{{ $errors->first() }}</div>
        @endif

        <form method="POST" action="{{ route('admin.login') }}">
            @csrf
            <label for="email">Email</label>
            <input type="email" id="email" name="email" value="{{ old('email') }}" required autofocus>

            <label for="password">Mot de passe</label>
            <input type="password" id="password" name="password" required>

            <label class="remember">
                <input type="checkbox" name="remember" value="1">
                Se souvenir de moi
            </label>

            <button type="submit">Se connecter</button>
        </form>
    </div>
</body>
</html>
