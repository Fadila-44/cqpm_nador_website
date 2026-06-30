<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreContactRequest;
use App\Mail\ContactSubmittedMail;
use App\Models\Contact;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class ContactController extends Controller
{
    public function store(StoreContactRequest $request): JsonResponse
    {
        $contact = Contact::create($request->validated());

        try {
            Mail::to(config('mail.admin_notify'))
                ->send(new ContactSubmittedMail($contact));
        } catch (\Throwable $e) {
            Log::error('Contact notification email failed', [
                'contact_id' => $contact->id,
                'error' => $e->getMessage(),
            ]);
        }

        return response()->json([
            'message' => 'Message envoyé avec succès.',
            'data' => [
                'id' => $contact->id,
            ],
        ], 201);
    }
}
