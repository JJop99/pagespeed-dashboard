<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;

class LoginController extends Controller
{
    public function SignIn(Request $request)
    {
        $attributes = request()->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $data = $request->all();
                        
        auth()->login(User::create([
            'email' => $data['email'],
            'password' => $data['password'] 
        ]));

        return redirect('/')->with('success', 'success', 'Welcome Back!.');
        
    }
    public function destroy()
    {
        auth()->logout();

        return redirect('/sign-in')->with('success', 'Goodbye!');
    }

}


