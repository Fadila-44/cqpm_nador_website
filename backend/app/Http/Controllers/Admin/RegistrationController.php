<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Registration;
use App\Http\Requests\StoreRegistrationRequest;
use Illuminate\View\View;

class RegistrationController extends Controller
{
    public function index(): View
    {
        return view('admin.registrations.index', [
            'registrations' => Registration::latest()->paginate(15),
        ]);
    }

    public function show(Registration $registration): View
    {
        return view('admin.registrations.show', [
            'registration' => $registration,
        ]);
    }
}
