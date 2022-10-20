<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;


class RegisterController extends Controller
{
    public function register(Request $request)
    {
        $attributes = request()->validate([
            'email' => 'required|email|max:255|unique:users,email',
            'password' => 'required|min:7|max:255',
        ]);
        $data = $request->all();
        User::create([
            'email' => $data['email'],
            'password' => $data['password']
        ]);
        

        auth()->login(User::create($attributes));

        return redirect('/')->with('success', 'Your account has been created.');
    }
}
