<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Ticket extends Model
{
    protected $fillable = ['order_id','price','slug','status'];
    
    public function ticketOrder(){
        return $this->BelongsTo('App\TicketOrder');
    }
}
