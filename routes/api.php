<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\LoginController;
use App\Http\Controllers\RegisterController;
use App\Http\Controllers\AuditController;
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

Route::post('logout', [LoginController::class, 'logout']); //log out api

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::middleware('auth:sanctum')->group(function () {
    Route::post('newUrl', [AuditController::class, 'audit']); //create new url api
    Route::get('sites', [AuditController::class, 'getSites']); //list of sites api
    Route::get('research', [AuditController::class, 'getAudits']); //research tests api
    Route::post('dashboard', [AuditController::class, 'getAudit']); //return pagespeed's calculate values api
    Route::post('researchForWeek', [AuditController::class, 'researchForWeek']); //performance for tot days api
    Route::get('results', [AuditController::class, 'getSitePerformances']); //every performance tests api
    Route::delete('deleteTests', [AuditController::class, 'deleteTests']);  //delete every tests with url's name api
    Route::delete('singleDelete', [AuditController::class, 'singleDelete']); //delete single test api
});
