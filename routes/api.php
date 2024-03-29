<?php

use Illuminate\Http\Request;

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

//Route::middleware('auth:api')->group(function(){
    Route::prefix('dashboard')->group(function(){
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
//});

Route::prefix('ticketing')->group(function(){
    Route::get('venue','VenueController@index');
    Route::post('orderTicket', 'TicketController@NewOrder');
});
