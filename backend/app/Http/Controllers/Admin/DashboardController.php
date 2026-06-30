<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\CmsEvent;
use App\Models\CmsGalleryItem;
use App\Models\CmsPage;
use App\Models\Contact;
use App\Models\Registration;
use App\Models\SiteVisit;
use Illuminate\View\View;

class DashboardController extends Controller
{
    public function index(): View
    {
        return view('admin.dashboard', [
            'contactsCount' => Contact::count(),
            'registrationsCount' => Registration::count(),
            'visitorsCount' => SiteVisit::count(),
            'visitorsToday' => SiteVisit::whereDate('visit_date', now()->toDateString())->count(),
            'eventsCount' => CmsEvent::count(),
            'galleryCount' => CmsGalleryItem::count(),
            'pagesCount' => CmsPage::count(),
            'recentContacts' => Contact::latest()->take(5)->get(),
            'recentRegistrations' => Registration::latest()->take(5)->get(),
            'recentEvents' => CmsEvent::latest()->take(5)->get(),
        ]);
    }
}
