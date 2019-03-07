<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Venue extends Model
{
    public function event(){
        return $this->hasOne('App\Event');
    }

    public function sections(){
        return $this->hasMany('App\Section');
    }

}
