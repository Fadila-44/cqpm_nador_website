<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreRegistrationRequest;
use App\Mail\RegistrationSubmittedMail;
use App\Models\Registration;
use App\Mail\RegistrationConfirmation;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class RegistrationController extends Controller
{
    public function store(StoreRegistrationRequest $request): JsonResponse
    {
        $data = $request->validated();

        $birthDate = sprintf(
            '%s-%s-%s',
            $data['birth_year'],
            str_pad($data['birth_month'], 2, '0', STR_PAD_LEFT),
            str_pad($data['birth_day'], 2, '0', STR_PAD_LEFT)
        );

        $registration = Registration::create([
            'training_type' => $data['training_type'],
            'section' => $data['section'],
            'last_name' => $data['last_name'],
            'first_name' => $data['first_name'],
            'gender' => $data['gender'],
            'email' => $data['email'],
            'country_code' => $data['country_code'],
            'phone' => $data['phone'],
            'birth_place' => $data['birth_place'],
            'birth_date' => $birthDate,
            'education' => $data['education'],
            'region' => $data['region'],
            'city' => $data['city'],
            'address' => $data['address'],
        ]);

        try {
            Mail::to($registration->email)
                ->send(new RegistrationConfirmation($registration));
        } catch (\Throwable $e) {
            Log::error('Registration confirmation email failed', [
                'registration_id' => $registration->id,
                'error' => $e->getMessage(),
            ]);
        }
        return response()->json([
            'message' => 'Candidature enregistrée avec succès.',
            'data' => [
                'id' => $registration->id,
            ],
        ], 201);
    }
}
