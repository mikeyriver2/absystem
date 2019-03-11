<?php

namespace App\Http\Controllers;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;

class AuthController extends Controller
{
    public function checkIfLoggedIn(Request $request){
        $user = $request->user ? $request->user : Auth::user() ? Auth::user() : null;
        if(isset($user)){
            return response()->json([
                'logged' => true
            ]);
        }else{
            return response()->json([
                'logged' => false
            ]);
        }
    }

    public function clearSession(Request $request){
        Auth::logout();
        \Session::flush();
    }
}
