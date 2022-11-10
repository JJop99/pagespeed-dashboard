<?php

namespace App\Http\Controllers;

use App\Models\Audit;
use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ProjectController extends Controller
{
    public function project(Request $request)
    {
        $project =  Project::create([
            'title' => $request['title'],
            'email' => Auth::user()->email

        ]);

        return response()->json($project);
    }

    public function getProjects(Request $request)
    {
        $validated = $request->validate([
            'filter' => 'required',
            'order' => 'required'
        ]);
        $take = $request['take'] ?? '5';
        $skip = $request['skip'] ?? '0';


        if ($request['order'] == 'desc') {
            $research = Project::select('title', 'id', 'created_at')
                ->where('email', Auth::user()->email)
                ->take($take)
                ->skip($skip)
                ->orderBy($validated['filter'], 'desc')
                ->get();
        } else {
            $research = Project::select('title', 'id', 'created_at')
                ->where('email', Auth::user()->email)
                ->take($take)
                ->skip($skip)
                ->orderBy($validated['filter'])
                ->get();
        }
        $total = Project::select('id')
            ->get()
            ->count();

        return response()->json([
            'projects' => $research,
            'total_projects' => $total
        ]);
    }
    public function getProject(Request $request)
    {
        $research = Project::select('title')
            ->where('id', $request['id'])
            ->where('email', Auth::user()->email)
            ->get();

        return response()->json([
            'project' => $research,
        ]);
    }

    public function deleteProject(Request $request)
    {
        $validated = $request->validate([
            'id' => 'required',
        ]);
        $audits = Audit::select('url')
            ->where('project_id', $validated['id'])
            ->delete();

        $result = Project::select('id')
            ->where('id', $validated['id'])
            ->delete();

        if ($result) {

            return response()->json(['message' => 'Successfully Deleted']);
        } else {
            return response()->json(['message' => 'Delete Failed']);
        }
    }

    public function editProject(Request $request)
    {
        $validated = $request->validate([
            'id' => 'required',
            'newTitle' => 'required',
        ]);

        $research = Project::where('id', $request['id'])
            ->where('email', Auth::user()->email)
            ->update(array('title' =>  $validated['newTitle']));


        return response()->json($research);
    }
}
