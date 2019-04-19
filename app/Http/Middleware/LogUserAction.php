<?php

namespace App\Http\Middleware;

use Closure;
use App\UserLog;
use Carbon\Carbon;

class LogUserAction
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        $user = $request->user();
        $namespace = $request->route()->getAction()['namespace']."\\";
        $action_controller = explode($namespace,$request->route()->getAction()["controller"])[1];
        $action = "";
        switch ($action_controller) {
            case "AuthController@clearSession":
                $action = "User Logged Out";
                break;
            case "AuthController@checkIfLoggedIn":
                $action = "User Logged In";
                break;
            case "VenueController@index":
                $action = "Dashboard API Called";
                break;
            case "TicketController@Order":
                $action = "User searched for ".$request->search."";
                break;
            case "TicketController@ViewOrder":
                $action = "User viewed order ".$request->code."";
                break;
            case "TicketController@VerifyPayment":
                $action = "User verified payment of order ID: ".$request->id."";
                break;
            case "TicketController@VerifyAttendance":
                $action = "User verified attendance of ticket ID: ".$request->id."";
                break;
            case "TicketController@EditOrder":
                $action = "User edit order ID: ".$request->order_id."";
                break;
            case "TicketController@EditChosenSeats":
                $action = "User edit seats of order ID: ".$request->order["id"]."";
                break;
            case "TicketController@DeleteOrder":
                $action = "User deleted order ID: ".$request->order_id."";
                break;
            default:
                $action = $action_controller;
        }

        if($action == "Dashboard API Called"){
            $now = Carbon::now();
            $time = UserLog::where('action','Dashboard API Called')->orderBy('id','desc')->first()->created_at;
            if($now->diffInSeconds($time) >= 60){ //to avoid filling up db too much, only log this action when action is at least a minute apart from latest similar action
                UserLog::create([ 
                    "user_id"   => $user->id,
                    "action"    => $action  
                ]);
        
            }
        }else{
            UserLog::create([
                "user_id"   => $user->id,
                "action"    => $action  
            ]);
        }

        return $next($request);
    }
}
