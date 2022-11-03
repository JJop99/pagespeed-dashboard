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

        return response()->json([
            'projects' => $research,
        ]);
    }
    public function deleteProject(Request $request)
    {
        $validated = $request->validate([
            'id' => 'required',
        ]);
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
