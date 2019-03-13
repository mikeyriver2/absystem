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
        Route::get('view-order/{code}','TicketController@ViewOrder');
        Route::post('orderTicket', 'TicketController@NewOrder');
    });
//});

Route::prefix('ticketing')->group(function(){
    Route::get('venue','VenueController@index');
    Route::post('orderTicket', 'TicketController@NewOrder');
});
