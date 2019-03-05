<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class TicketOrder extends Model
{
    protected $fillable = [
        'buyer_first_name','buyer_last_name','buyer_email','buyer_cell_number','event_id'
    ];

    public function tickets(){
        return $this->hasMany('App\Ticket');
    }

    public function event(){
        return $this->belongsTo('App\Event');
    }
}
