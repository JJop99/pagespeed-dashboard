<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;

class LoginController extends Controller
{
    public function login(Request $request)
    {
        $data = $request->all();
        
        User::create([
            'email' => $data['email'],
            'password' => $data['password']
        ]);

        return response()->json([
            'login' => [
                'email' => $data['email'],
                'password' => $data['password']
            ],
        ]);
    }

    public function store()
    {
        $attributes = request()->validate([
            'email' => 'required|email|max:255|unique:users,email',
            'password' => 'required|min:7|max:255',
        ]);

        auth()->login(User::create($attributes));

        return redirect('/')->with('success', 'Your account has been created.');
    }
}


