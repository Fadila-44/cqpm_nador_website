<?php

namespace App\Http\Controllers\Admin\Api;

use App\Http\Controllers\Controller;
use App\Models\Registration;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Response;

class RegistrationController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Registration::query()->latest();

        if ($request->filled('filiere')) {
            $query->where(function ($q) use ($request) {
                $q->where('training_type', $request->filiere)
                    ->orWhere('section', $request->filiere);
            });
        }

        if ($request->filled('status')) {
            if ($request->status === 'unread') {
                $query->where('is_read', false);
            } elseif ($request->status === 'read') {
                $query->where('is_read', true);
            }
        }

        if ($request->filled('date_from')) {
            $query->whereDate('created_at', '>=', $request->date_from);
        }

        if ($request->filled('date_to')) {
            $query->whereDate('created_at', '<=', $request->date_to);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('first_name', 'like', "%{$search}%")
                    ->orWhere('last_name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('training_type', 'like', "%{$search}%");
            });
        }

        return response()->json($query->paginate($request->integer('per_page', 10)));
    }

    public function show(Registration $registration): JsonResponse
    {
        return response()->json($registration);
    }

    public function markRead(Registration $registration): JsonResponse
    {
        $registration->update(['is_read' => true]);

        return response()->json(['message' => 'Inscription marquée comme lue.', 'registration' => $registration]);
    }

    public function destroy(Registration $registration): JsonResponse
    {
        $registration->delete();

        return response()->json(['message' => 'Inscription supprimée.']);
    }

    public function export(Request $request)
    {
        $registrations = Registration::latest()->get();
        $columns = ['id', 'training_type', 'section', 'last_name', 'first_name', 'gender', 'email',
            'country_code', 'phone', 'birth_place', 'birth_date', 'education', 'region', 'city', 'address', 'is_read', 'created_at'];

        $callback = function () use ($registrations, $columns) {
            $file = fopen('php://output', 'w');
            fputcsv($file, $columns);
            foreach ($registrations as $r) {
                $row = [];
                foreach ($columns as $col) {
                    $val = $r->{$col};
                    $row[] = $val instanceof \DateTimeInterface ? $val->format('Y-m-d') : $val;
                }
                fputcsv($file, $row);
            }
            fclose($file);
        };

        return Response::stream($callback, 200, [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="inscriptions.csv"',
        ]);
    }
}
