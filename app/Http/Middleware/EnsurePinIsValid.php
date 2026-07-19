<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use App\Models\ProtocolPin; // Sesuaikan dengan nama model PIN-mu

class EnsurePinIsValid
{
    public function handle(Request $request, Closure $next): Response
    {
        $pin = $request->header('X-Protokol-Pin');

        if (!$pin || !ProtocolPin::where('pin', $pin)->where('is_active', true)->exists()) {
            return response()->json([
                'success' => false, 
                'message' => 'Akses ditolak. PIN tidak valid'
            ], 401);
        }

        return $next($request);
    }
}