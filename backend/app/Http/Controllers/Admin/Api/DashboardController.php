<?php

namespace App\Http\Controllers\Admin\Api;

use App\Http\Controllers\Controller;
use App\Models\CmsEvent;
use App\Models\CmsHeroSlide;
use App\Models\CmsPage;
use App\Models\Contact;
use App\Models\Registration;
use App\Models\SiteSection;
use Illuminate\Http\JsonResponse;

class DashboardController extends Controller
{
    public function index(): JsonResponse
    {
        $pagesTotal = CmsPage::count() + SiteSection::count();
        $pagesPublished = CmsPage::where('is_published', true)->count() + SiteSection::where('is_published', true)->count();
        $pagesDraft = max(0, $pagesTotal - $pagesPublished);

        return response()->json([
            'stats' => [
                'articles_total' => $pagesTotal,
                'articles_published' => $pagesPublished,
                'articles_draft' => $pagesDraft,
                'slides_active' => CmsHeroSlide::where('is_active', true)->count(),
                'messages' => Contact::count(),
                'messages_unread' => Contact::where('is_read', false)->count(),
                'registrations' => Registration::count(),
                'registrations_unread' => Registration::where('is_read', false)->count(),
                'registrations_this_month' => Registration::whereMonth('created_at', now()->month)
                    ->whereYear('created_at', now()->year)
                    ->count(),
                'events_total' => CmsEvent::count(),
                'events_published' => CmsEvent::where('is_published', true)->count(),
            ],
            'recent_events' => CmsEvent::latest()->take(5)->get()->map(fn ($e) => [
                'id' => $e->id,
                'title' => data_get($e->content, 'fr.title', $e->slug),
                'category' => $e->category,
                'is_published' => $e->is_published,
                'created_at' => $e->created_at,
            ]),
            'recent_contacts' => Contact::latest()->take(5)->get(),
            'recent_registrations' => Registration::latest()->take(5)->get(),
            'notifications' => $this->buildNotifications(),
        ]);
    }

    public function unreadCount(): JsonResponse
    {
        return response()->json([
            'messages_unread' => Contact::where('is_read', false)->count(),
            'registrations_unread' => Registration::where('is_read', false)->count(),
            'total' => Contact::where('is_read', false)->count() + Registration::where('is_read', false)->count(),
        ]);
    }

    public function notifications(): JsonResponse
    {
        return response()->json($this->buildNotifications());
    }

    private function buildNotifications(): array
    {
        $unreadContacts = Contact::where('is_read', false)->latest()->take(5)->get()->map(fn ($c) => [
            'id' => $c->id,
            'type' => 'contact',
            'name' => $c->full_name,
            'subject' => $c->subject,
            'created_at' => $c->created_at,
        ]);

        $unreadRegistrations = Registration::where('is_read', false)->latest()->take(5)->get()->map(fn ($r) => [
            'id' => $r->id,
            'type' => 'registration',
            'name' => trim("{$r->first_name} {$r->last_name}"),
            'subject' => $r->training_type ?? $r->section ?? 'Inscription',
            'created_at' => $r->created_at,
        ]);

        $items = $unreadContacts->concat($unreadRegistrations)
            ->sortByDesc('created_at')
            ->take(5)
            ->values();

        return [
            'count' => Contact::where('is_read', false)->count() + Registration::where('is_read', false)->count(),
            'items' => $items,
        ];
    }
}
