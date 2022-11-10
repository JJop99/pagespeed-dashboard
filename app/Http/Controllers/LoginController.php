<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class LoginController extends Controller
{
    public function signIn(Request $request)
    {
        $attributes = request()->validate([
            'email' => 'required|email|exists:users',
            'password' => 'required',
        ]);
        if (Auth::attempt($attributes)) {
            return redirect('/sitelist')->with('success', 'Welcome Back!.');
        }
    }

    public function logout()
    {
        Auth::guard('web')->logout();
        return response()->json(['message' => 'Logged Out'], 200);
    }
}
