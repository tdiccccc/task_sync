<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class UserController extends Controller
{
    /**
     * 認証済みユーザー情報を返す
     */
    public function __invoke(Request $request): JsonResponse
    {
        $user = $request->user();
        $user->load('roles');

        return response()->json([
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'hourly_rate' => $user->hourly_rate,
                'is_valid' => $user->is_valid,
                'roles' => $user->roles->pluck('name')->values(),
            ],
        ]);
    }
}