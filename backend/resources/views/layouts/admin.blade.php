<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>@yield('title', 'Admin') — CQPM Nador</title>
    <style>
        :root {
            --sidebar: #0f1f3d;
            --sidebar-hover: #1a2f52;
            --accent: #c9a227;
            --accent-dark: #a8861f;
            --bg: #f0f2f6;
            --card: #ffffff;
            --text: #1a2b3c;
            --muted: #64748b;
            --border: #e2e8f0;
            --success: #059669;
            --danger: #dc2626;
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: "Segoe UI", system-ui, sans-serif; background: var(--bg); color: var(--text); line-height: 1.5; }
        a { color: var(--sidebar); text-decoration: none; }
        a:hover { text-decoration: underline; }
        .admin-shell { min-height: 100vh; display: flex; }
        .admin-sidebar {
            width: 260px; background: var(--sidebar); color: #fff; display: flex; flex-direction: column;
            position: fixed; inset: 0 auto 0 0; z-index: 100;
        }
        .sidebar-brand { padding: 1.25rem 1.25rem 1rem; border-bottom: 1px solid rgba(255,255,255,0.08); }
        .sidebar-brand strong { display: block; font-size: 0.95rem; }
        .sidebar-brand span { font-size: 0.75rem; opacity: 0.65; }
        .sidebar-nav { flex: 1; padding: 1rem 0.75rem; overflow-y: auto; }
        .sidebar-nav a {
            display: flex; align-items: center; gap: 0.65rem; padding: 0.65rem 0.85rem;
            border-radius: 8px; color: rgba(255,255,255,0.82); font-size: 0.88rem; margin-bottom: 0.2rem;
        }
        .sidebar-nav a:hover { background: var(--sidebar-hover); text-decoration: none; color: #fff; }
        .sidebar-nav a.active { background: var(--accent); color: #1a1a1a; font-weight: 600; }
        .sidebar-nav .nav-group { margin: 1rem 0 0.35rem; padding: 0 0.85rem; font-size: 0.68rem; text-transform: uppercase; letter-spacing: 0.08em; opacity: 0.45; }
        .sidebar-footer { padding: 1rem 0.75rem; border-top: 1px solid rgba(255,255,255,0.08); }
        .sidebar-footer a { display: block; padding: 0.55rem 0.85rem; color: rgba(255,255,255,0.7); font-size: 0.85rem; }
        .admin-main { margin-left: 260px; flex: 1; min-width: 0; display: flex; flex-direction: column; }
        .admin-topbar {
            background: var(--card); border-bottom: 1px solid var(--border); padding: 0.85rem 1.5rem;
            display: flex; align-items: center; justify-content: space-between; gap: 1rem;
        }
        .admin-topbar h1 { font-size: 1.15rem; font-weight: 600; }
        .admin-topbar p { font-size: 0.82rem; color: var(--muted); margin-top: 0.1rem; }
        .admin-topbar-actions { display: flex; align-items: center; gap: 0.75rem; }
        .admin-topbar-actions form button {
            background: none; border: 1px solid var(--border); border-radius: 8px; padding: 0.45rem 0.85rem;
            cursor: pointer; font: inherit; color: var(--text);
        }
        .admin-body { padding: 1.5rem; flex: 1; }
        .card { background: var(--card); border: 1px solid var(--border); border-radius: 12px; padding: 1.25rem; box-shadow: 0 1px 3px rgba(0,0,0,0.04); }
        .card + .card { margin-top: 1rem; }
        .page-title { font-size: 1.35rem; margin-bottom: 0.25rem; }
        .page-subtitle { color: var(--muted); font-size: 0.9rem; margin-bottom: 1.25rem; }
        .stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(170px, 1fr)); gap: 1rem; margin-bottom: 1.5rem; }
        .stat-card {
            background: var(--card); border: 1px solid var(--border); border-radius: 12px;
            padding: 1.15rem 1.25rem; display: flex; flex-direction: column; gap: 0.2rem;
        }
        .stat-card .label { color: var(--muted); font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.05em; font-weight: 600; }
        .stat-card .value { font-size: 1.85rem; font-weight: 700; }
        .stat-icon { font-size: 1.25rem; margin-bottom: 0.15rem; }
        .stat-card-visitors .value { color: #2563eb; }
        .stat-card-today .value { color: #059669; }
        .stat-card-contacts .value { color: #d97706; }
        .stat-card-registrations .value { color: #7c3aed; }
        .stat-card-events .value { color: #0891b2; }
        .stat-card-gallery .value { color: #be185d; }
        table { width: 100%; border-collapse: collapse; }
        th, td { text-align: left; padding: 0.75rem; border-bottom: 1px solid var(--border); vertical-align: top; }
        th { font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.04em; color: var(--muted); }
        .btn { display: inline-block; padding: 0.55rem 1rem; border-radius: 8px; border: 1px solid transparent; font-size: 0.88rem; cursor: pointer; text-decoration: none; }
        .btn-primary { background: var(--accent); color: #1a1a1a; font-weight: 600; }
        .btn-primary:hover { background: var(--accent-dark); text-decoration: none; color: #1a1a1a; }
        .btn-outline { background: #fff; border-color: var(--border); color: var(--text); }
        .btn-outline:hover { text-decoration: none; }
        .btn-danger { background: var(--danger); color: #fff; }
        .badge { display: inline-block; padding: 0.2rem 0.55rem; border-radius: 999px; font-size: 0.72rem; font-weight: 600; }
        .badge-success { background: #ecfdf5; color: #047857; }
        .badge-draft { background: #fff7ed; color: #c2410c; }
        .toolbar { display: flex; justify-content: space-between; align-items: center; gap: 1rem; margin-bottom: 1rem; flex-wrap: wrap; }
        .empty { color: var(--muted); padding: 2rem; text-align: center; }
        .alert { padding: 0.75rem 1rem; border-radius: 8px; margin-bottom: 1rem; }
        .alert-success { background: #ecfdf5; color: #047857; border: 1px solid #a7f3d0; }
        .form-grid { display: grid; gap: 1rem; }
        .form-row { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1rem; }
        label.field-label { display: block; font-size: 0.85rem; font-weight: 600; margin-bottom: 0.35rem; }
        input[type="text"], input[type="email"], input[type="number"], input[type="password"], input[type="file"], select, textarea {
            width: 100%; padding: 0.65rem 0.75rem; border: 1px solid var(--border); border-radius: 8px; font: inherit;
        }
        textarea { min-height: 120px; resize: vertical; }
        .tabs { display: flex; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 1rem; }
        .tab-btn { padding: 0.45rem 0.85rem; border: 1px solid var(--border); background: #fff; border-radius: 999px; cursor: pointer; }
        .tab-btn.active { background: var(--sidebar); color: #fff; border-color: var(--sidebar); }
        .tab-panel { display: none; }
        .tab-panel.active { display: block; }
        .thumb { max-width: 180px; border-radius: 8px; border: 1px solid var(--border); }
        .actions { display: flex; gap: 0.5rem; flex-wrap: wrap; }
        .help { font-size: 0.8rem; color: var(--muted); margin-top: 0.25rem; }
        .list-row { display: flex; align-items: center; justify-content: space-between; gap: 1rem; padding: 0.85rem 0; border-bottom: 1px solid var(--border); }
        .list-row:last-child { border-bottom: 0; }
        .list-row-meta { font-size: 0.82rem; color: var(--muted); }
        @media (max-width: 900px) {
            .admin-sidebar { width: 100%; position: relative; }
            .admin-main { margin-left: 0; }
            .admin-shell { flex-direction: column; }
        }
    </style>
</head>
<body>
    <div class="admin-shell">
        <aside class="admin-sidebar">
            <div class="sidebar-brand">
                <strong>Administration</strong>
                <span>CQPM Nador</span>
            </div>
            <nav class="sidebar-nav">
                <a href="{{ route('admin.dashboard') }}" @class(['active' => request()->routeIs('admin.dashboard')])>📊 Tableau de bord</a>

                <div class="nav-group">Contenu du site</div>
                <a href="{{ route('admin.sections.edit', 'home') }}" @class(['active' => request()->is('admin/sections/home*')])>🏠 Accueil</a>
                <a href="{{ route('admin.sections.edit', 'presentation') }}" @class(['active' => request()->is('admin/sections/presentation*')])>📋 Présentation</a>
                <a href="{{ route('admin.sections.edit', 'director') }}" @class(['active' => request()->is('admin/sections/director*')])>👤 Mot du Directeur</a>
                <a href="{{ route('admin.sections.edit', 'infrastructure') }}" @class(['active' => request()->is('admin/sections/infrastructure*')])>🏗 Organigramme</a>
                <a href="{{ route('admin.sections.edit', 'numbers') }}" @class(['active' => request()->is('admin/sections/numbers*')])>📈 Chiffres</a>
                <a href="{{ route('admin.sections.edit', 'fishery') }}" @class(['active' => request()->is('admin/sections/fishery*')])>⚓ Filière Pêche</a>
                <a href="{{ route('admin.sections.edit', 'machine') }}" @class(['active' => request()->is('admin/sections/machine*')])>⚙ Filière Machine</a>
                <a href="{{ route('admin.sections.edit', 'admission') }}" @class(['active' => request()->is('admin/sections/admission*')])>📝 Admission</a>
                <a href="{{ route('admin.gallery.index') }}" @class(['active' => request()->routeIs('admin.gallery.*')])>🖼 Galerie</a>
                <a href="{{ route('admin.events.index') }}" @class(['active' => request()->routeIs('admin.events.*')])>📅 Événements</a>
                <a href="{{ route('admin.sections.edit', 'contact') }}" @class(['active' => request()->is('admin/sections/contact*')])>✉ Contact</a>
                <a href="{{ route('admin.sections.edit', 'registration') }}" @class(['active' => request()->is('admin/sections/registration*')])>📋 Inscription</a>

                <div class="nav-group">Configuration</div>
                <a href="{{ route('admin.cms.pages.index') }}" @class(['active' => request()->routeIs('admin.cms.pages.*')])>📄 Pages CMS</a>
                <a href="{{ route('admin.cms.slides.index') }}" @class(['active' => request()->routeIs('admin.cms.slides.*')])>🎞 Slides hero</a>
                <a href="{{ route('admin.cms.nav.index') }}" @class(['active' => request()->routeIs('admin.cms.nav.*')])>🧭 Navigation</a>
                <a href="{{ route('admin.cms.media.index') }}" @class(['active' => request()->routeIs('admin.cms.media.*')])>📁 Médias</a>

                <div class="nav-group">Formulaires</div>
                <a href="{{ route('admin.contacts.index') }}" @class(['active' => request()->routeIs('admin.contacts.*')])>💬 Messages</a>
                <a href="{{ route('admin.registrations.index') }}" @class(['active' => request()->routeIs('admin.registrations.*')])>📥 Inscriptions</a>
            </nav>
            <div class="sidebar-footer">
                <a href="/" target="_blank" rel="noopener">↗ Voir le site</a>
            </div>
        </aside>

        <div class="admin-main">
            <header class="admin-topbar">
                <div>
                    <h1>@yield('title', 'Administration')</h1>
                    <p>Centre de Qualification Professionnelle Maritime — Nador</p>
                </div>
                <div class="admin-topbar-actions">
                    <form method="POST" action="{{ route('admin.logout') }}">
                        @csrf
                        <button type="submit">Déconnexion</button>
                    </form>
                </div>
            </header>
            <main class="admin-body">
                @if (session('success'))
                    <div class="alert alert-success">{{ session('success') }}</div>
                @endif
                @yield('content')
            </main>
        </div>
    </div>
    @stack('scripts')
</body>
</html>
