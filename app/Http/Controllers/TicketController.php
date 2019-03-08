<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\TicketOrder;
use App\Ticket;
use App\Section;
use App\EventDay;

class TicketController extends Controller
{
    
    public function Order(Request $request){
        $orders = TicketOrder::where('event_id',1)
                    ->with('tickets')
                    ->paginate(5);
        
        return response()->json([
            'orders' => $orders
        ]);
    }

    public function NewOrder(Request $request){

        $order = TicketOrder::create([
            'buyer_first_name'  =>  $request->first_name,
            'buyer_last_name'  =>  $request->last_name,
            'buyer_email'  =>  $request->email,
            'buyer_cell_number'  =>  $request->cell_number,
            'event_id'  =>  $request->event['id'],
            'event_day_id' => EventDay::where('date',$request->selected_date)
                                        ->where('event_id',$request->event['id'])
                                        ->first()->id
        ]);
        
        foreach($request->chosen_seats as $key => $value){
            Ticket::create([
                'order_id' => $order->id,
                'slug' => $value["seat_id"],
                'status' => "unvalidated",
                'section_id' => Section::where('name',$value["section_name"])->first()->id
            ]);
        }
    }

}
