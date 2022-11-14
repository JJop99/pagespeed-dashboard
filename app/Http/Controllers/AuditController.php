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

        $input = Audit::select('firstContentfulPaint', 'speedIndex', 'largestContentfulPaint', 'totalBlockingTime', 'cumulativeLayoutShift', 'interactive', 'url', 'title', 'performance')
            ->where('id', $validated['id'])
            ->where('email', Auth::user()->email)
            ->where('project_id', $project['id'])
            ->get();

        $statistics = [
            'firstContentfulPaint' => $input[0]['firstContentfulPaint'],
            'speedIndex' => $input[0]['speedIndex'],
            'largestContentfulPaint' => $input[0]['largestContentfulPaint'],
            'totalBlockingTime' => $input[0]['totalBlockingTime'],
            'cumulativeLayoutShift' => $input[0]['cumulativeLayoutShift'],
            'interactive' => $input[0]['interactive'],
        ];

        $performance = [
            'url' => $input[0]['url'],
            'title' => $input[0]['title'],
            'performance' => $input[0]['performance'],
        ];

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

        $research = Audit::select('url', 'title', 'id', 'created_at')
            ->where('project_id', $project['id'])
            ->where('email', Auth::user()->email)
            ->orderBy($validated['filter'], $validated['order']);

        $query = $research->clone();
        $research = $research->take($take)->skip($skip)->get();
        $total = $query->get()->count();

        return response()->json([
            'urls' => $research,
            'total_urls' => $total
        ]);
    }

    public function getSitePerformances(Request $request, Project $project)
    {
        $validated = $request->validate([
            'url' => 'required',

        ]);

        //$startDate = $request->from ? Carbon::parse($request->from)->format('Y-m-d') : Carbon::now()->subDays(31)->format('Y-m-d');
        //$endDate =  $request->to ? Carbon::parse($request->to)->format('Y-m-d') : Carbon::now()->format('Y-m-d');
        $startDate = Carbon::parse($request->from)->format('Y-m-d');
        $endDate = Carbon::parse($request->to)->format('Y-m-d');
        
        $research = Audit::select('performance', 'created_at')
            ->where('project_id', $project['id'])
            ->where('email', Auth::user()->email)
            ->where('url', $validated['url'])
            ->whereDate('created_at', '>=', $startDate)->whereDate('created_at', '<=', $endDate)
            ->orderBy('created_at')
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

        $results = Audit::select('url')
            ->where('project_id', $project['id'])
            ->where('email', Auth::user()->email)
            ->groupBy('url')
            ->orderBy('url', $request['order']);

        $query = $results->clone();
        $results = $results->take($take)->skip($skip)->get();
        $total = $query->groupBy('url')->get()->count();

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
        $results = Audit::where('project_id', $project['id'])
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

        $result = Audit::where('project_id', $project['id'])
            ->where('id', $validated['id'])
            ->update(array('title' =>  $validated['newTitle']));

        return response()->json($result);
    }
}
