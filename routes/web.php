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
Route::get('send-email', [EmailController::class, 'sendEmail']);

Route::get('/{any}', function () {
    return view('home');
})->where('any', '.*');


// Route::post('forgot', function (Request $request) {
//     $request->validate(['email' => 'required|email']);
 
//     $status = Password::sendResetLink(
//         $request->only('email')
//     );
 
//     return $status === Password::RESET_LINK_SENT
//                 ? back()->with(['status' => __($status)])
//                 : back()->withErrors(['email' => __($status)]);
// })->middleware('guest')->name('password.email');

// Route::get('/reset-password/{token}', function ($token) {
//     return view('auth.reset-password', ['token' => $token]);
// })->middleware('guest')->name('password.reset');

//Route::get('/forgot-password', function () {
//    return view('auth.forgot-password');
//})->middleware('guest')->name('password.request');
//
//Route::post('/forgot-password', function (Request $request) {
//    $request->validate(['email' => 'required|email']);
//
//    $status = Password::sendResetLink(
//        $request->only('email')
//    );
//
//    return $status === Password::RESET_LINK_SENT
//        ? back()->with(['status' => __($status)])
//        : back()->withErrors(['email' => __($status)]);
//})->middleware('guest')->name('password.email');
//
//Route::get('/reset-password/{token}', function ($token) {
//    return view('auth.reset-password', ['token' => $token]);
//})->middleware('guest')->name('password.reset');
//
//
//Route::post('/reset-password', function (Request $request) {
//    $request->validate([
//        'token' => 'required',
//        'email' => 'required|email',
//        'password' => 'required|min:8|confirmed',
//    ]);
//
//    $status = Password::reset(
//        $request->only('email', 'password', 'password_confirmation', 'token'),
//        function ($user, $password) {
//            $user->forceFill([
//                'password' => Hash::make($password)
//            ])->setRememberToken(Str::random(60));
//
//            $user->save();
//
//            event(new PasswordReset($user));
//        }
//    );
//
//    return $status === Password::PASSWORD_RESET
//        ? redirect()->route('login')->with('status', __($status))
//        : back()->withErrors(['email' => [__($status)]]);
//})->middleware('guest')->name('password.update');
//