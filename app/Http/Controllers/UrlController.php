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

        $response = Http::get('https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=' . $url);

        if($response->failed()){
            info($response->body());
            abort($response->status());
        }
        $body = $response->json();
        info($response->json());
        
        $firstContentfulPaint = $body['lighthouseResult']['audits']['first-contentful-paint'];
        $speedIndex = $body['lighthouseResult']['audits']['speed-index'];
        $largestContentfulPaint = $body['lighthouseResult']['audits']['largest-contentful-paint'];
        $totalBlockingTime = $body['lighthouseResult']['audits']['total-blocking-time'];
        $cumulativeLayoutShift = $body['lighthouseResult']['audits']['cumulative-layout-shift'];
        $interactive = $body['lighthouseResult']['audits']['interactive'];

        
        Url::create([
            'email'=> $email,
            'title' => $title,
            'url' => $url, 
            'firstContentfulPaint' => json_encode($firstContentfulPaint),
            'speedIndex' => json_encode($speedIndex),
            'largestContentfulPaint' => json_encode($largestContentfulPaint),
            'totalBlockingTime' => json_encode($totalBlockingTime),
            'cumulativeLayoutShift' => json_encode($cumulativeLayoutShift),
            'interactive' => json_encode($interactive)
        ]);

        return response()->json([
            $email,
            $url, 
            $title
        //    $firstContentfulPaint,
        //    $speedIndex,
        //    $largestContentfulPaint,
        //    $totalBlockingTime,
        //    $cumulativeLayoutShift,
        //    $interactive
        ]);
    }
    public function dashboard(Request $request){
        $validated = $request->validate([
            'id' => 'required'
        ]);
        $statistics = URL::select('firstContentfulPaint','speedIndex', 'largestContentfulPaint', 'totalBlockingTime', 'cumulativeLayoutShift', 'interactive')
        ->where('id', $validated['id'])
        ->get();

        return response()->json($statistics);
    }
    
    public function research(Request $request){
        $validated = $request->validate([
            'email' => 'required'
        ]);

        $research = URL::select('url', 'title', 'id', 'created_at')
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
