<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;


class LoginController extends Controller
{
    public function SignIn(Request $request)
    {
        $attributes = request()->validate([
            'email' => 'required|email|exists:users',
            'password' => 'required',
        ]);

        return redirect('/')->with('success', 'success', 'Welcome Back!.');
        
    }
    public function destroy()
    {
        //auth()->logout();
        //return redirect('/sign-in')->with('success', 'Goodbye!');
        Auth::logout();
        return response()->json(['message' => 'Logged Out'], 200);
    }

}


