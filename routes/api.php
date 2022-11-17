<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\LoginController;
use App\Http\Controllers\RegisterController;
use App\Http\Controllers\AuditController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\PasswordController;
/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});



Route::post('signIn', [LoginController::class, 'signIn']);

Route::post('signUp', [RegisterController::class, 'signUp']);


Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});


Route::middleware('auth:sanctum')->group(function () {
    Route::post('change', [PasswordController::class, 'change']);

    Route::get('project/{project}/audits', [AuditController::class, 'getAudits']);
    Route::post('project/{project}/audit', [AuditController::class, 'audit']);
    Route::post('project', [ProjectController::class, 'project']);
    Route::get('editProject', [ProjectController::class, 'editProject']);
    Route::get('projects', [ProjectController::class, 'getProjects']);
    Route::get('project', [ProjectController::class, 'getProject']);
    Route::get('project/{project}/edit', [AuditController::class, 'editAudit']);
    Route::delete('deleteProject', [ProjectController::class, 'deleteProject']);
    Route::delete('project/{project}/deleteTests', [AuditController::class, 'deleteTests']);
    Route::delete('project/{project}/singleDelete', [AuditController::class, 'singleDelete']);
    Route::get('project/{project}/sites', [AuditController::class, 'getSites']);
    Route::get('project/{project}/audit', [AuditController::class, 'getAudit']);
    Route::get('project/{project}/sitePerformances', [AuditController::class, 'getSitePerformances']);
    Route::get('logout', [LoginController::class, 'logout']);
});
