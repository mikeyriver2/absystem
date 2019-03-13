<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\TicketOrder;
use App\Ticket;
use App\Section;
use App\EventDay;

class TicketController extends Controller
{

    public function ViewOrder(Request $request, $code){
        $ticket = Ticket::where('slug',$code)
                        ->whereHas('ticketOrder',function($order){
                            $order->whereHas('event',function($event){
                                $event->where('id',1);
                            });
                        })
                        ->first();
        $order = $ticket->ticketOrder->load('tickets.section','tickets','tickets.ticketOrder','event','eventDay');
        
        return response()->json([
            'order' => $order,
            'ticket' => $ticket
        ]);
    }
    
    public function Order(Request $request){
        if(!isset($request->search)){
            $orders = TicketOrder::where('event_id',1)
                        ->with('tickets.section','tickets','tickets.ticketOrder','event','eventDay')
                        ->paginate(5);
        }else{
            $search = $request->search;
            $orders = TicketOrder::where('buyer_first_name','like',"%".$search."%")
                        ->orWhere('buyer_last_name','like',"%".$search."%")
                        ->orWhere('buyer_email','like',"%".$search."%")
                        ->orWhere('buyer_cell_number',$search)
                        ->orWhereHas('tickets',function($ticket)use($search){
                            $ticket->where('slug','like',"%".$search."%");
                        })
                        ->where('event_id',1)
                        ->with('tickets.section','tickets','tickets.ticketOrder','event','eventDay')
                        ->paginate(5);
        }

        
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
