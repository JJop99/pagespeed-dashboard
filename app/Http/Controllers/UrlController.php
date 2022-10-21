<?php

namespace App\Http\Controllers;

use App\Models\Url;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;

class UrlController extends Controller
{
    public function newUrl(Request $request){
        
        $data = $request->all();
        $email = $data['email'];
        $title = $data['title'];
        $url = $data['url'];


        if(!Str::startsWith($url, ['http://', 'https://'])){
            $url = 'https://' . $url;
        }

        Url::create([
            'email'=> $email,
            'title' => $title,
            'url' => $url, 
        ]);
        
        $response = Http::get('https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=' . $url);
       

        if($response->failed()){
            info($response->body());
            abort($response->status());
        }

        info($response->json());

        return response()->json([
            'email'=> $email,
            'url' => $url 
        ]);
    }

    public function research(Request $request){
        $validated = $request->validate([
            'email' => 'required'
        ]);

        $research = URL::select('url')
        ->where('email', $validated['email'])
        ->get();

        //$take = 100;
        //$skip = 9;

        //$currentPage = Request::get('page', 1);
        //$research = URL::select('url')
        //->where('email', $validated['email'])        
        //->take(100)
        //->skip($skip + (($currentPage - 1) * $take))        
        //->orderBy('url','desc'); 

        return response()->json([
            'urls' => $research
        ]);
    }
}
