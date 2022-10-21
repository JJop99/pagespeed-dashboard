<?php

namespace App\Http\Controllers;

use App\Models\Url;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class UrlController extends Controller
{
    public function newUrl(Request $request){
        
        //$attributes = $request->validate([
        //    'email' => 'required|email',
        //    'url' => 'required',
        //    'title' => 'required'
        //]);
        $data = $request->all();
        info($data);
        $email = $data['email'];
        $title = $data['title'];
        $url = $data['url'];

        Url::create([
            'email'=> $email,
            'title' => $title,
            'url' => $url, 
        ]);
        $response = Http::get('https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=' . $url);

        if($response->failed()){
            abort($response->status());
        }


        return response()->json([
            'email'=> $email,
            'url' => $url 
        ]);
    }

    public function research(Request $request){
        $validated = $request->validate([
            'email' => 'required'
        ]);

        $email = $validated['email'];

        $research = URL::select('url')
        ->where('email', $email);
        //->get();

        return response()->json([
            'urls' => $research
        ]);
    }
}
