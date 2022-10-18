<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/



// Route::view('/{path?}', 'home')
//     ->where('path', '.*');

Route::get('/{any}', function () {
    return view('home');
})->where('any', '.*');

Route::post('sign-in', [LoginController::class, 'SignIn']);

Route::get('login', [SessionsController::class, 'create']);
Route::post('login', [SessionsController::class, 'store']);

Route::post('logout', [SessionsController::class, 'destroy'])->middleware('auth');
