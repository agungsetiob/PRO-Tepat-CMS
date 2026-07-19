<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class VerifyApiSignature
{
    public function handle(Request $request, Closure $next): Response
    {
        $timestamp = $request->header('X-Timestamp');
        $signature = $request->header('X-Signature');
        $secret = env('MOBILE_APP_SECRET');

        // 1. Pastikan header tersedia
        if (!$timestamp || !$signature) {
            return response()->json(['message' => 'Unauthorized.'], 401);
        }

        // 2. Cegah Replay Attack (Tolak jika request lebih tua dari 59 detik)
        if (abs(time() - $timestamp) > 59) {
            return response()->json(['message' => 'Unauthorized - Request Expired'], 401);
        }

        $path = $request->path();
        $queryString = $request->getQueryString();
        $fullPath = $path . ($queryString ? '?' . $queryString : '');

        // Ambil isi Body untuk POST/PUT/PATCH
        $bodyString = '';
        if (in_array($request->method(), ['POST', 'PUT', 'PATCH'])) {
            $bodyString = $request->getContent(); // Mengambil raw JSON string
        }

        // Gabungkan persis seperti di React Native
        $payload = $request->method() . $fullPath . $timestamp . $bodyString;
        
        $expectedSignature = hash_hmac('sha256', $payload, $secret);

        if (!hash_equals($expectedSignature, $signature)) {
            return response()->json(['message' => 'Unauthorized - Invalid Signature'], 401);
        }

        return $next($request);
    }
}