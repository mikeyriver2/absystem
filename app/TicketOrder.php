<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class TicketOrder extends Model
{
    protected $fillable = [
        'buyer_first_name',
        'buyer_last_name',
        'buyer_email',
        'buyer_cell_number',
        'event_id',
        'event_day_id',
        'student_id',
        'student_year_course'
    ];

    protected $appends = [
        'buyer_full_name'
    ];

    public function tickets(){
        return $this->hasMany('App\Ticket','order_id');
    }

    public function event(){
        return $this->belongsTo('App\Event');
    }

    public function eventDay(){
        return $this->belongsTo('App\EventDay');
    }

    public function getBuyerFullNameAttribute(){
        return " ".$this->attributes['buyer_first_name']." ".$this->attributes['buyer_last_name']."";
    }
}
