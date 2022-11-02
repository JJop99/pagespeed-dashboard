<?php

namespace App\Http\Controllers;

use App\Models\Audit;
use App\Models\Project;
use Illuminate\Http\Request;

class ProjectController extends Controller
{
    public function create(Request $request)
    {
      $project =  Project::create([
            'name'=>'ciao',

        ]);
        
        return response()->json($project);
    }
}
