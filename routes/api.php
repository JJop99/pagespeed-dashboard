<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\LoginController;
use App\Http\Controllers\RegisterController;
use App\Http\Controllers\AuditController;
use App\Http\Controllers\ProjectController;
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



Route::post('signIn', [LoginController::class, 'signIn']);//sign in api

Route::post('signUp', [RegisterController::class, 'signUp']); //sign up api


Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});


Route::middleware('auth:sanctum')->group(function () {
Route::post('project', [ProjectController::class, 'project']);
Route::get('projects', [ProjectController::class, 'getProjects']);
Route::delete('deleteProject', [ProjectController::class, 'deleteProject']);
Route::post('project/{project}/audit', [AuditController::class, 'audit']); //create new url api
Route::delete('project/{project}/deleteTests', [AuditController::class, 'deleteTests']);  //delete every tests with url's name api
Route::delete('project/{project}/singleDelete', [AuditController::class, 'singleDelete']); //delete single test api
Route::get('project/{project}/sites', [AuditController::class, 'getSites']); //list of sites api
Route::get('project/{project}/audits', [AuditController::class, 'getAudits']); //research tests api
Route::get('project/{project}/audit', [AuditController::class, 'getAudit']); //return pagespeed's calculate values api
Route::get('project/{project}/sitePerformances', [AuditController::class, 'getSitePerformances']); //every performance tests api
Route::get('logout', [LoginController::class, 'logout']); //log out api

});
