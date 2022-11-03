<?php

namespace App\Http\Controllers;

use App\Models\Audit;
use App\Models\Project;
use Illuminate\Http\Request;

class ProjectController extends Controller
{
    public function project(Request $request)
    {
      $project =  Project::create([
            'name'=>$request['name'],

        ]);
        
        return response()->json($project);
    }

    public function getProjects(Request $request){

        $take = $request['take'] ?? '5';
        $skip = $request['skip'] ?? '0';

        $research = Project::select('name','id')
            ->take($take)
            ->skip($skip)
            ->orderBy('created_at', 'desc')
            ->get();
        
        $total = Project::select('id')
            ->get()
            ->count();

        return response()->json([
            'projects' => $research,
            'total_projects' => $total
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
}
