<?php

namespace App\Http\Controllers;

use App\Models\Audit;
use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

class AuditController extends Controller
{

    public function audit(Request $request, Project $project)
    {

        $data = $request->all();
        $email = Auth::user()->email;
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


        $audit = $project->audits()->create([
            'email' => $email,
            'title' => $title,
            'url' => $url,
            'firstContentfulPaint' => json_encode($firstContentfulPaint),
            'speedIndex' => json_encode($speedIndex),
            'largestContentfulPaint' => json_encode($largestContentfulPaint),
            'totalBlockingTime' => json_encode($totalBlockingTime),
            'cumulativeLayoutShift' => json_encode($cumulativeLayoutShift),
            'interactive' => json_encode($interactive),
            'performance' => $performance,

        ]);

        info($audit);
        return response()->json([
            $performance,
            $email,
            $url,
            $title
        ]);
    }
    public function getAudit(Request $request, Project $project)
    {

        $validated = $request->validate([
            'id' => 'required'
        ]);
        $statistics = Audit::select('firstContentfulPaint', 'speedIndex', 'largestContentfulPaint', 'totalBlockingTime', 'cumulativeLayoutShift', 'interactive')
            ->where('id', $validated['id'])
            ->where('project_id', $project['id'])
            ->get();

        $performance = Audit::select('url', 'title', 'performance')
            ->where('id', $validated['id'])
            ->where('project_id', $project['id'])
            ->get();

        return [
            $statistics,
            $performance
        ];
    }

    public function getAudits(Request $request, Project $project)
    {
        $validated = $request->validate([
            'filter' => 'required',
            'order' => 'required'
        ]);
        $take = $request['take'] ?? '5';
        $skip = $request['skip'] ?? '0';
        if ($request['order'] == 'desc') {
            $research = Audit::select('url', 'title', 'id', 'created_at')
                ->where('email', Auth::user()->email)
                ->where('project_id', $project['id'])
                ->take($take)
                ->skip($skip)
                ->orderBy($validated['filter'], 'desc')
                ->get();
        } else {
            $research = Audit::select('url', 'title', 'id', 'created_at')
                ->where('email', Auth::user()->email)
                ->where('project_id', $project['id'])
                ->take($take)
                ->skip($skip)
                ->orderBy($validated['filter'])
                ->get();
        }

        $total = Audit::select('url')
            ->where('email', Auth::user()->email)
            ->where('project_id', $project['id'])
            ->count();

        return response()->json([
            'urls' => $research,
            'total_urls' => $total
        ]);
    }

    public function getSitePerformances(Request $request, Project $project)
    {
        $validated = $request->validate([
            'url' => 'required'
        ]);

        $startDate = $request->from ? Carbon::parse($request->from)->format('Y-m-d') : Carbon::now()->subDays(31)->format('Y-m-d');
        $endDate =  $request->to ? Carbon::parse($request->to)->format('Y-m-d') : Carbon::now()->format('Y-m-d');
        info($startDate);
        info($endDate);
        $research = Audit::select('performance', 'created_at')
            ->where('email', Auth::user()->email)
            ->where('project_id', $project['id'])
            ->where('url', $validated['url'])
            ->whereDate('created_at', '>=', $startDate)->whereDate('created_at', '<=', $endDate)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'urls' => $research,
        ]);
    }
    public function getSites(Request $request, Project $project)
    {
        $validated = $request->validate([
            'filter' => 'required',
            'order' => 'required'
        ]);
        $take = $request['take'] ?? '5';
        $skip = $request['skip'] ?? '0';
        if ($request['order'] == 'desc') {
        $results = Audit::select('url')
            ->where('email', Auth::user()->email)
            ->where('project_id', $project['id'])
            ->groupBy('url')
            ->take($take)
            ->skip($skip)
            ->orderBy($validated['filter'], 'desc')
            ->get();
        }else{
            $results = Audit::select('url')
            ->where('email', Auth::user()->email)
            ->where('project_id', $project['id'])
            ->groupBy($validated['filter'])
            ->take($take)
            ->skip($skip)
            ->orderBy('url')
            ->get();
        }
        $total = Audit::select('url')
            ->where('email', Auth::user()->email)
            ->where('project_id', $project['id'])
            ->groupBy('url')
            ->get()
            ->count();

        return response()->json([
            'urls' => $results,
            'total_urls' => $total
        ]);
    }

    public function singleDelete(Request $request, Project $project)
    {
        $validated = $request->validate([
            'id' => 'required'
        ]);
        $result = Audit::select('url')
            ->where('email', Auth::user()->email)
            ->where('project_id', $project['id'])
            ->where('id', $validated['id'])
            ->delete();

        if ($result) {

            return response()->json(['message' => 'Successfully Deleted']);
        } else {
            return response()->json(['message' => 'Delete Failed']);
        }
    }

    public function deleteTests(Request $request, Project $project)
    {
        $validated = $request->validate([
            'url' => 'required',
        ]);
        $results = Audit::select('url')
            ->where('email', Auth::user()->email)
            ->where('project_id', $project['id'])
            ->where('url', $validated['url'])
            ->delete();

        if ($results) {

            return response()->json(['message' => 'Successfully Deleted']);
        } else {
            return response()->json(['message' => 'Delete Failed']);
        }
    }
    public function editAudit(Request $request, Project $project)
    {
        $validated = $request->validate([
            'id' => 'required',
            'newTitle' => 'required',
        ]);

        $result = Audit::where('email', Auth::user()->email)
            ->where('project_id', $project['id'])
            ->where('id', $validated['id'])
            ->update(array('title' =>  $validated['newTitle']));

        return response()->json($result);
    }
}
