<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ApiController;
use App\Http\Controllers\LoginController;
use App\Http\Controllers\RegisterController;
use App\Http\Controllers\UrlController;
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
    Route::get('test', [ApiController::class, 'test']); //test api
    Route::post('newUrl', [UrlController::class, 'newUrl']); //create new url api
    Route::post('sites', [UrlController::class, 'sites']); //list of sites api
    Route::post('research', [UrlController::class, 'research']); //research tests api
    Route::post('dashboard', [UrlController::class, 'dashboard']); //return pagespeed's calculate values api
    Route::post('researchForWeek', [UrlController::class, 'researchForWeek']); //performance for tot days api
    Route::post('results', [UrlController::class, 'results']); //every performance tests api
    Route::delete('deleteTests', [UrlController::class, 'deleteTests']);  //delete every tests with url's name api
    Route::delete('singleDelete', [UrlController::class, 'singleDelete']); //delete single test api
});
