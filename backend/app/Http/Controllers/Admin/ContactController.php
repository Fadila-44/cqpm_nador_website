<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Contact;
use Illuminate\View\View;

class ContactController extends Controller
{
    public function index(): View
    {
        return view('admin.contacts.index', [
            'contacts' => Contact::latest()->paginate(15),
        ]);
    }

    public function show(Contact $contact): View
    {
        return view('admin.contacts.show', [
            'contact' => $contact,
        ]);
    }
}
