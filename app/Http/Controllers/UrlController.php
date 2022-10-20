<?php

namespace App\Http\Controllers;

use App\Models\Url;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class UrlController extends Controller
{
    public function newUrl(Request $request){
        
        $attributes = request()->validate([
            'email' => 'required|email',
            'url' => 'required',
            'title' => 'required'
        ]);
        $data = $request->all();
        $email = $data['email'];
        $title = $data['title'];
        $url = $data['url'];
        Url::create([

            'email'=> $email,
            'title' => $title,
            'url' => $url,
            
        ]);

        return response()->json([
            'email'=> $email,
            'url' => $url 
        ]);
    }
}
