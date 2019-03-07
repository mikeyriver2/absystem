<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class EventDay extends Model
{
    public function event(){
        return $this->belongsTo('App\Event');
    }

    public function ticketOrder(){
        return $this->hasOne('App\TicketOrder');
    }
}
