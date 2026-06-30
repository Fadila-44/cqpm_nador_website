<?php

namespace App\Http\Controllers\Admin\Api;

use App\Http\Controllers\Controller;
use App\Models\Contact;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Response;

class ContactController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Contact::query()->latest();

        if ($request->filled('status')) {
            if ($request->status === 'unread') {
                $query->where('is_read', false);
            } elseif ($request->status === 'read') {
                $query->where('is_read', true);
            }
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('full_name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('subject', 'like', "%{$search}%");
            });
        }

        return response()->json($query->paginate($request->integer('per_page', 10)));
    }

    public function show(Contact $contact): JsonResponse
    {
        return response()->json($contact);
    }

    public function markRead(Contact $contact): JsonResponse
    {
        $contact->update(['is_read' => true]);

        return response()->json(['message' => 'Message marqué comme lu.', 'contact' => $contact]);
    }

    public function bulkMarkRead(Request $request): JsonResponse
    {
        $data = $request->validate(['ids' => ['required', 'array'], 'ids.*' => ['integer']]);
        Contact::whereIn('id', $data['ids'])->update(['is_read' => true]);

        return response()->json(['message' => 'Messages marqués comme lus.']);
    }

    public function destroy(Contact $contact): JsonResponse
    {
        $contact->delete();

        return response()->json(['message' => 'Message supprimé.']);
    }

    public function bulkDestroy(Request $request): JsonResponse
    {
        $data = $request->validate(['ids' => ['required', 'array'], 'ids.*' => ['integer']]);
        Contact::whereIn('id', $data['ids'])->delete();

        return response()->json(['message' => 'Messages supprimés.']);
    }

    public function export(Request $request)
    {
        $contacts = Contact::latest()->get();

        $headers = ['ID', 'Nom', 'Email', 'Sujet', 'Message', 'Lu', 'Date'];
        $rows = $contacts->map(fn ($c) => [
            $c->id,
            $c->full_name,
            $c->email,
            $c->subject,
            $c->message,
            $c->is_read ? 'Oui' : 'Non',
            $c->created_at?->format('Y-m-d H:i'),
        ]);

        $callback = function () use ($headers, $rows) {
            $file = fopen('php://output', 'w');
            fputcsv($file, $headers);
            foreach ($rows as $row) {
                fputcsv($file, $row);
            }
            fclose($file);
        };

        return Response::stream($callback, 200, [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="messages.csv"',
        ]);
    }
}
