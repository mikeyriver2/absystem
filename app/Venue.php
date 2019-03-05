<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Venue extends Model
{
    public function venue(){
        return $this->belongsTo('App\Event');
    }

    public function sections(){
        return $this->hasMany('App\Section');
    }
}
