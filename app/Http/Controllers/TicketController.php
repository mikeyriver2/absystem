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
        $orders = TicketOrder::where('event_id',1)
                            ->with('tickets.section','tickets','tickets.ticketOrder','event','eventDay');

        //return EventDay::where('date',$request->selected_date)->get();   
        $bool_date = isset($request->selected_date);
        $bool_search = isset($request->search);
        if($bool_search){
            $search = $request->search;
            if(!$bool_date ||  $request->selected_date == "all"){
            $orders->where('buyer_first_name','like',"%".$search."%")
                ->orWhere('buyer_last_name','like',"%".$search."%")
                ->orWhere('buyer_email','like',"%".$search."%")
                ->orWhere('buyer_cell_number',$search)
                ->orWhereHas('tickets',function($ticket)use($search){
                    $ticket->where('slug','like',"%".$search."%");
                });
            }
        }
        
        if($bool_date){
            $date = $request->selected_date;
            $search = $request->search;
            if($date != "all"){
                $orders->whereHas('eventDay',function($event)use($date){
                    $event->where('date',$date);
                });
                $orders->where(function($query)use($search){
                    $query->where('buyer_first_name','like',"%".$search."%")
                    ->orWhere('buyer_last_name','like',"%".$search."%")
                    ->orWhere('buyer_email','like',"%".$search."%")
                    ->orWhere('buyer_cell_number',$search)
                    ->orWhereHas('tickets',function($ticket)use($search){
                        $ticket->where('slug','like',"%".$search."%");
                    });
                });
            }else{
                //
            }
        }
        $orders->orderBy('created_at','desc');
        return response()->json([
            'orders' => $orders->paginate(5)
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
                'section_id' => Section::where('name',$value["section_name"])->first()->id,
                'ticket_price' => $value['ticket_price']
            ]);
        }
    }

    public function Verify(Request $request){
        $order = TicketOrder::find($request->id);
        $order->paid = true;
        $order->save();
        return 'saved';
    }

}
