<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\TicketOrder;
use App\Ticket;
use App\Section;

class TicketController extends Controller
{
    public function Order(Request $request){
        $order = TicketOrder::create([
            'buyer_first_name'  =>  $request->first_name,
            'buyer_last_name'  =>  $request->last_name,
            'buyer_email'  =>  $request->email,
            'buyer_cell_number'  =>  $request->cell_number,
            'event_id'  =>  1,
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
