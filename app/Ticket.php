<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Ticket extends Model
{
    protected $fillable = ['order_id','price','slug','status','section_id'];
    
    public function ticketOrder(){
        return $this->belongsTo('App\TicketOrder','order_id');
    }

    public function section(){
        return $this->belongsTo('App\Section');
    }
}
