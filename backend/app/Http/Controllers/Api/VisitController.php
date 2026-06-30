<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SiteVisit;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class VisitController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        $visitorHash = hash('sha256', $request->ip().'|'.$request->userAgent());

        SiteVisit::firstOrCreate([
            'visitor_hash' => $visitorHash,
            'visit_date' => now()->toDateString(),
        ]);

        return response()->json([
            'total' => SiteVisit::count(),
            'today' => SiteVisit::whereDate('visit_date', now()->toDateString())->count(),
        ]);
    }
}
