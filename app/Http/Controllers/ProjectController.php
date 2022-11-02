<?php

namespace App\Http\Controllers;

use App\Models\Audit;
use Illuminate\Http\Request;

class ProjectController extends Controller
{
    public function store(Audit $audit)
    {
        request()->validate([
            'url' => 'required'
        ]);

        $audit->audits()->create([
            'user_id' => request()->user()->id,
            'url' => request('url'),
            'audit_id' =>request()->audit()->id
        ]);

        return back();
    }
}
