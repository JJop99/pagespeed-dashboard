<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;

class LoginController extends Controller
{
    public function SignIn(Request $request)
    {
        $attributes = request()->validate([
            'email' => 'required|email|max:255|unique:users,email',
            'password' => 'required|min:7|max:255',
        ]);

        $data = $request->all();
                        
        auth()->login(User::create([
            'email' => $data['email'],
            'password' => $data['password'] 
        ]));

        return redirect('/')->with('success', 'Your account has been created.');
        
    }

}


