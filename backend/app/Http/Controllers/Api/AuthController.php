<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Validation\ValidationException;
use App\Models\User;
use PHPOpenSourceSaver\JWTAuth\Facades\JWTAuth;

class AuthController extends Controller
{
    protected int $maxAttempts = 5;
    protected int $decayMinutes = 1;

    public function login(Request $request)
    {
        $request->validate([
            'email'    => 'required|email',
            'password' => 'required|string',
        ]);

        $this->ensureIsNotRateLimited($request);

        if (! $token = JWTAuth::attempt($request->only('email', 'password'))) {
            RateLimiter::hit($this->throttleKey($request), $this->decayMinutes * 60);

            throw ValidationException::withMessages([
                'email' => ['Email atau password salah.'],
            ]);
        }

        RateLimiter::clear($this->throttleKey($request));

        $user = JWTAuth::user();

        return $this->respondWithToken($token, $user);
    }

    public function register(Request $request)
    {
        $data = $request->validate([
            'name'                  => 'required|string|max:255',
            'email'                 => 'required|email|unique:users,email',
            'password'              => 'required|string|min:6|confirmed',
        ]);

        $user = User::create([
            'name'     => $data['name'],
            'email'    => $data['email'],
            'password' => bcrypt($data['password']),
        ]);

        $token = JWTAuth::fromUser($user);

        return $this->respondWithToken($token, $user);
    }

    public function me()
    {
        return response()->json([
            'user' => JWTAuth::parseToken()->authenticate(),
        ]);
    }

    public function logout()
    {
        JWTAuth::invalidate(JWTAuth::getToken());

        return response()->json([
            'message' => 'Berhasil logout',
        ]);
    }

    protected function respondWithToken(string $token, User $user)
    {
        return response()->json([
            'access_token' => $token,
            'token_type'   => 'Bearer',
            'expires_in'   => JWTAuth::factory()->getTTL() * 60,
            'user' => [
                'id'    => $user->id,
                'name'  => $user->name,
                'email' => $user->email,
            ],
        ]);
    }

    protected function ensureIsNotRateLimited(Request $request): void
    {
        if (RateLimiter::tooManyAttempts($this->throttleKey($request), $this->maxAttempts)) {
            throw ValidationException::withMessages([
                'email' => [
                    'Terlalu banyak percobaan login. Coba lagi dalam '
                    . RateLimiter::availableIn($this->throttleKey($request)) . ' detik.'
                ],
            ]);
        }
    }

    protected function throttleKey(Request $request): string
    {
        return strtolower($request->input('email')) . '|' . $request->ip();
    }
}
