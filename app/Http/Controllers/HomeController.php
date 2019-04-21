<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\User;
use App\UserLog;

class HomeController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('auth');
    }

    /**
     * Show the application dashboard.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return view('home');
    }

    public function getUsers(Request $request){
        $user = $request->user();
            if($user->type == "eb"){
            $users = User::all()->load(['actionLogs' => function($actionLog){
                $actionLog->orderBy('id','desc');
            }]);
            return $users;
        }else{
            return response("You don't have access",403);
        }
    }

    public function getUser(Request $request){
        return $request->user();
    }
}
