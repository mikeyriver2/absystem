<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\TicketOrder;
use App\Ticket;
use App\Section;
use App\EventDay;

class TicketController extends Controller
{
    public function DeleteOrder(Request $request){
        $order_id = $request->order_id;
        $order = TicketOrder::find($order_id);
        $tickets = $order->tickets;
        foreach($tickets as $ticket){
            Ticket::destroy($ticket->id);
        }
        TicketOrder::destroy($order->id);

        return "Delete Successful";
    }

    public function ViewOrder(Request $request){
        $code = $request->code;
        $date = $request->chosen_date;
        $ticket = Ticket::where('slug',$code)
                        ->whereHas('ticketOrder',function($order)use($date){
                            $order->whereHas('event',function($event){
                                $event->where('id',1);
                            });
                            $order->whereHas('eventDay',function($event)use($date){
                                $event->where('date',$date);
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
                //->orWhere('buyer_cell_number',$search)
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
                    //->orWhere('buyer_cell_number',$search)
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
        $chosen_seat_codes = collect($request->chosen_seats)->map(function($seat){
            return $seat["seat_id"];
        });

        $check = Ticket::whereIn('slug',$chosen_seat_codes->toArray())
                        ->whereHas('ticketOrder',function($order)use($request){
                            $order->whereHas('eventDay',function($eventDay)use($request){
                                $eventDay->where('date',$request->chosen_seats[0]['date']);
                            });
                        })
                        ->get();

        if(count($check) > 0 && isset($check)){
            return response("error",403);
        }

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
            if(strpos($value["section_name"],"[VIP] ") > -1){
                $exploded = explode("[VIP] ",$value["section_name"]);
                $value["section_name"] = $exploded[1];
            }
            Ticket::create([
                'order_id' => $order->id,
                'slug' => $value["seat_id"],
                'status' => "unvalidated",
                'section_id' => Section::where('name',$value["section_name"])->first()->id,
                'ticket_price' => $value['ticket_price']
            ]);
        }
    }

    public function VerifyPayment(Request $request){
        $order = TicketOrder::find($request->id);
        $order->paid = true;
        $order->save();
        return 'saved';
    }

    public function VerifyAttendance(Request $request){
        $ticket = Ticket::find($request->id);
        $ticket->status = "validated";
        $ticket->save();
    }

    public function EditOrder(Request $request){
        $order = TicketOrder::find($request->order_id);
        $order->buyer_first_name = $request->first_name;
        $order->buyer_last_name = $request->last_name;
        $order->buyer_email = $request->email;
        $order->paid = $request->paid;
        $order->save();

        return "success";
    }

    public function EditChosenSeats(Request $request){
        $order = TicketOrder::find($request->order["id"]);
        $chosen_date = $order['event_day']['date'];
        $new_chosen_seats = $request->new_chosen_seats;
        $seats = $order->tickets;
        if($chosen_date != $order->eventDay->date){
            $dayt = EventDay::find($order->eventDay->id);
            $order->event_id = $dayt->id;
            $order->save();
            foreach ($seats as $index => $current_seat) { //remove all tickets from last date
                Ticket::destroy($current_seat->id);
            }
            foreach ($new_chosen_seats as $new_seat){
                Ticket::create([
                    'order_id' => $order['id'],
                    'slug' => $new_seat['seat_id'],
                    'status' => "unvalidated",
                    'section_id' => Section::where('name',$new_seat["section_name"])->first()->id,
                    'ticket_price' => $new_seat['ticket_price']
                ]);
            }
        }else{
            foreach ($new_chosen_seats as $new_seat) {
                $new_seat_bool = false; //to check if the new_seat is already amongst the selected selected seats
                foreach ($seats as $index => $current_seat){
                    $current_seat_bool = false; //to check if the old_seat is already amongst the selected new seats
                    if ($new_seat['seat_id'] == $current_seat->slug) {
                        $new_seat_bool = true; 
                        $current_seat_bool = true;                  
                    }
                }
                if (!$new_seat_bool){ //if seat is not yet part of the already, create new
                    Ticket::create([
                        'order_id' => $order['id'],
                        'slug' => $new_seat['seat_id'],
                        'status' => "unvalidated",
                        'section_id' => Section::where('name',$new_seat["section_name"])->first()->id,
                        'ticket_price' => $new_seat['ticket_price']
                    ]);
                }
                
                foreach ($seats as $index => $current_seat) {
                    $new_seat_bool = false; 
                    foreach ($new_chosen_seats as $new_seat){
                        if ($new_seat['seat_id'] == $current_seat->slug) {
                            $new_seat_bool = true; 
                        }
                    }
                    if (!$new_seat_bool){ 
                        Ticket::destroy($current_seat->id);
                    }
                }
            }
        }

        return TicketOrder::find($request->order["id"])->load('tickets','tickets.section');
    }

}
