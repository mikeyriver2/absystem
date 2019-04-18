<?php

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

Route::middleware('auth:web','logUserAction')->group(function(){
    Route::get('login-check','AuthController@checkIfLoggedIn');
    Route::get('logout','AuthController@clearSession');
    
    Route::prefix('dashboard')->group(function(){
        Route::get('users','HomeController@getUsers');
        Route::get('venue','VenueController@index');
        Route::post('orders','TicketController@Order');
        Route::post('view-order','TicketController@ViewOrder');
        Route::post('orderTicket', 'TicketController@NewOrder');
        Route::post('verify-payment', 'TicketController@VerifyPayment');
        Route::post('verify-attendance', 'TicketController@VerifyAttendance');
        Route::prefix('edit')->group(function(){
            Route::put('order','TicketController@EditOrder');
            Route::put('seats','TicketController@EditChosenSeats');
            Route::put('delete','TicketController@DeleteOrder');
        });
    });
});

Route::prefix('ticketing')->group(function(){
    Route::get('venue','VenueController@index');
    Route::post('orderTicket', 'TicketController@NewOrder');
});

Auth::routes();

Route::get('{any}', function(){
    return view('app');
})->where('any', '.*');

Route::get('/home', 'HomeController@index')->name('home');
