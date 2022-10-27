<?php

namespace App\Http\Controllers;

use App\Models\Url;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;

class UrlController extends Controller
{
    public function newUrl(Request $request)
    {

        $data = $request->all();
        $email = $data['email'];
        $title = $data['title'];
        $url = $data['url'];

        if (!Str::startsWith($url, ['http://', 'https://'])) {
            $url = 'https://' . $url;
        }

        $response = Http::get('https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=' . $url);

        if ($response->failed()) {
            abort($response->status());
        }
        $body = $response->json();

        $firstContentfulPaint = $body['lighthouseResult']['audits']['first-contentful-paint'];
        $speedIndex = $body['lighthouseResult']['audits']['speed-index'];
        $largestContentfulPaint = $body['lighthouseResult']['audits']['largest-contentful-paint'];
        $totalBlockingTime = $body['lighthouseResult']['audits']['total-blocking-time'];
        $cumulativeLayoutShift = $body['lighthouseResult']['audits']['cumulative-layout-shift'];
        $interactive = $body['lighthouseResult']['audits']['interactive'];


        //calculate performance
        $fCPaint = $body['lighthouseResult']['audits']['first-contentful-paint']['score'];
        $sIndex = $body['lighthouseResult']['audits']['speed-index']['score'];;
        $lCPaint = $body['lighthouseResult']['audits']['largest-contentful-paint']['score'];
        $tBTime = $body['lighthouseResult']['audits']['total-blocking-time']['score'];
        $cLShift = $body['lighthouseResult']['audits']['cumulative-layout-shift']['score'];
        $int = $body['lighthouseResult']['audits']['interactive']['score'];

        $performance = (int)(($fCPaint * 10) + ($sIndex * 10) +  ($lCPaint * 25) + ($tBTime * 30) + ($cLShift * 15) + ($int * 10)) / 100;

        Url::create([
            'email' => $email,
            'title' => $title,
            'url' => $url,
            'firstContentfulPaint' => json_encode($firstContentfulPaint),
            'speedIndex' => json_encode($speedIndex),
            'largestContentfulPaint' => json_encode($largestContentfulPaint),
            'totalBlockingTime' => json_encode($totalBlockingTime),
            'cumulativeLayoutShift' => json_encode($cumulativeLayoutShift),
            'interactive' => json_encode($interactive),
            'performance' => $performance
        ]);


        return response()->json([
            $performance,
            $email,
            $url,
            $title
        ]);
    }
    public function dashboard(Request $request)
    {

        $validated = $request->validate([
            'id' => 'required'
        ]);
        $statistics = URL::select('firstContentfulPaint', 'speedIndex', 'largestContentfulPaint', 'totalBlockingTime', 'cumulativeLayoutShift', 'interactive')
            ->where('id', $validated['id'])
            ->get();

        $performance = URL::select('performance')
            ->where('id', $validated['id'])
            ->get();

        return [
            $statistics,
            $performance
        ];
    }

    public function research(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required'
        ]);

        //$page = $request->page;
        $take = $request['take'];
        $skip = 0;
        //$currentPage = Request::get('page', 1); 
        $currentPage = request()->get('page', 0);
        $research = URL::select('url', 'title', 'id', 'created_at')
            ->where('email', $validated['email'])
            ->take(($take * ($currentPage + 1)))
            ->skip($skip + (($currentPage) * $take))
            ->orderBy('created_at', 'desc')
            ->get();

        $total = URL::select('url')
            ->where('email', $validated['email'])
            ->count();


        return response()->json([
            'urls' => $research,
            'total_urls' => $total
        ]);
    }

    public function results(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required',
            'url' => 'required'
        ]);

        $results = URL::select('performance', 'created_at')

            ->where('url', $validated['url'])
            ->where('email', $validated['email'])
            ->get();

        return response()->json([
            $results
        ]);
    }
    public function sites(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required',
        ]);
        //$page = $request->page;
        $take = $request['take'];
        $skip = 0;
        //$currentPage = Request::get('page', 1);
        $currentPage = request()->get('page', 1);
        $results = URL::select('url')
            ->where('email', $validated['email'])
            ->take(($take * ($currentPage)))
            ->skip($skip + (($currentPage - 1) * $take))
            ->groupBy('url')
            ->get();
        $total = URL::select('url')
            ->where('email', $validated['email'])
            ->groupBy('url')
            ->count();
        return response()->json([
            'urls' => $results,
            'total_urls' => $total
        ]);
    }

    public function singleDelete(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required',
            'url' => 'required',
            'created_at' => 'required'
        ]);
        $result = URL::select('url')
            ->where('email', $validated['email'])
            ->where('url', $validated['url'])
            ->where('created_at', $validated['created_at'])
            ->delete();

        if ($result) {

            return response()->json(['message' => 'Successfully Deleted']);
        } else {
            return response()->json(['message' => 'Delete Failed']);
        }
    }

    public function deleteTests(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required',
            'url' => 'required',
        ]);
        $results = URL::select('url')
            ->where('email', $validated['email'])
            ->where('url', $validated['url'])
            ->delete();

        if ($results) {

            return response()->json(['message' => 'Successfully Deleted']);
        } else {
            return response()->json(['message' => 'Delete Failed']);
        }
    }
}
