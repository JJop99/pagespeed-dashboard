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

    public function dashboard(Request $request){

        //$validated = $request->validate([
        //    'email' => 'required',
        //    'title' => 'required'
        //]);
        $data = $request->all();
        $url = $data['url'];
        //$url = URL::select('url')
        //->where('email', $validated['email'])
        //->and('title', $data['title'])
        //->get();

        if(!Str::startsWith($url, ['http://', 'https://'])){
            $url = 'https://' . $url;
        }

        $response = Http::get('https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=' . $url);

        if($response->failed()){
            info($response->body());
            abort($response->status());
        }
        $body=$response->json();
        info($response->json());
        $firstContentfulPaint = $body['data']['data']['lighthouseResult']['audits']['first-contentful-paint'];
        $speedIndex = $body['data']['data']['lighthouseResult']['audits']['speed-index'];
        $largestContentfulPaint = $body['data']['data']['lighthouseResult']['audits']['largest-contentful-paint'];
        $totalBlockingTime = $body['data']['data']['lighthouseResult']['audits']['total-blocking-time'];
        $cumulativeLayoutShift = $body['data']['data']['lighthouseResult']['audits']['cumulative-layout-shift'];
        $interactive = $body['data']['data']['lighthouseResult']['audits']['interactive'];

        return response()->json([
            $firstContentfulPaint,
            $speedIndex,
            $largestContentfulPaint,
            $totalBlockingTime,
            $cumulativeLayoutShift,
            $interactive
        ]);
    }

    public function research(Request $request){
        $validated = $request->validate([
            'email' => 'required'
        ]);

        $research = URL::select('url', 'title')
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
            'urls' => $research,
        ]);
    }
}
