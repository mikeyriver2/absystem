<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Event extends Model
{
    public function ticketOrders(){
        return $this->hasMany('App\TicketOrder');
    }

    public function venue(){
        return $this->belongsTo('App\Venue');
    }

    public function eventDays(){
        return $this->hasMany('App\EventDay');
    }
}
