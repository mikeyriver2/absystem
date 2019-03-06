<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Venue;
use App\Section;
class VenueController extends Controller
{
    public function index(){
        $venue = Venue::where('name','Singson')
                ->with(['sections' => function($query){
                    $query->orderBy('order','asc');
                }])->first();

        $section_types = Section::select('type')
                            ->where('venue_id',$venue->id)
                            ->groupBy('type')
                            ->orderBy('type_order','asc')
                            ->get();

        return response()->json([
            'venue' => $venue,
            'section_types' => $section_types
        ]);
    }
}
