<?php

namespace App\Http\Controllers;

use App\Models\Audit;
use DateTime;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

class AuditController extends Controller
{

    public function audit(Request $request)
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

        Audit::create([
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
    public function getAudit(Request $request)
    {

        $validated = $request->validate([
            'id' => 'required'
        ]);
        $statistics = Audit::select('firstContentfulPaint', 'speedIndex', 'largestContentfulPaint', 'totalBlockingTime', 'cumulativeLayoutShift', 'interactive')
            ->where('id', $validated['id'])
            ->get();

        $performance = Audit::select('performance')
            ->where('id', $validated['id'])
            ->get();

        return [
            $statistics,
            $performance
        ];
    }

    public function getAudits(Request $request)
    {
        
        $take = $request['take'] ?? '5';
        $skip = $request['skip'] ?? '0';

        $research = Audit::select('url', 'title', 'id', 'created_at')
            ->where('email', Auth::user()->email)
            ->take($take)
            ->skip($skip)
            ->orderBy('created_at', 'desc')
            ->get();

        $total = Audit::select('url')
            ->where('email', Auth::user()->email)
            ->count();


        return response()->json([
            'urls' => $research,
            'total_urls' => $total
        ]);
    }

    public function getSitePerformances(Request $request)
    {
        $validated = $request->validate([
            'url' => 'required'
        ]);

        $take = $request['take'] ?? '5';
        $skip = $request['skip'] ?? '0';

        //info(Carbon::now()->format('Y-m-d'));
        //info(Carbon::now()->subDays(31)->format('Y-m-d'));
        //dare valori di default ultimo mese
        $startDate = date('Y-m-d', strtotime($request->start_date)) ?? Carbon::now()->subDays(31)->format('Y-m-d');
        $endDate =   date('Y-m-d', strtotime($request->end_date)) ?? Carbon::now()->format('Y-m-d');

        $research = Audit::select('performance', 'created_at')
            ->where('email', Auth::user()->email)
            ->where('url', $validated['url'])
            ->whereDate('created_at', '>=', $startDate)->whereDate('created_at', '<=', $endDate)
            ->take($take)
            ->skip($skip)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'urls' => $research,
        ]);
    }
    public function getSites(Request $request)
    {
        $take = $request['take'] ?? '5';
        $skip = $request['skip'] ?? '0';

        $results = Audit::select('url')
            ->where('email', Auth::user()->email)
            ->groupBy('url')
            ->take($take)
            ->skip($skip)
            ->orderBy('url', 'desc')
            ->get();

        $total = Audit::select('url')
            ->where('email', Auth::user()->email)
            ->groupBy('url')
            ->get()
            ->count();

        return response()->json([
            'urls' => $results,
            'total_urls' => $total
        ]);
    }

    public function singleDelete(Request $request)
    {
        $validated = $request->validate([
            'url' => 'required',
            'created_at' => 'required'
        ]);
        $result = Audit::select('url')
            ->where('email', Auth::user()->email)
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
            'url' => 'required',
        ]);
        $results = Audit::select('url')
            ->where('email', Auth::user()->email)
            ->where('url', $validated['url'])
            ->delete();

        if ($results) {

            return response()->json(['message' => 'Successfully Deleted']);
        } else {
            return response()->json(['message' => 'Delete Failed']);
        }
    }
}
