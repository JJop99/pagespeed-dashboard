<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;

class LoginController extends Controller
{
    public function signIn(Request $request)
    {
        $attributes = request()->validate([
            'email' => 'required|email|exists:users',
            'password' => 'required',
        ]);
        if ( ! Auth::attempt($attributes)) {
            throw ValidationException::withMessages([
                'email' => 'Your provided credentials could not be right.'
            ]);
            
            return redirect('/sitelist')->with('success', 'Welcome Back!.');
        } 
    }

    public function logout()
    {
        Auth::guard('web')->logout();
        return response()->json(['message' => 'Logged Out'], 200);
    }
}
