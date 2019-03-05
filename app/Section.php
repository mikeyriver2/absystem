<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Section extends Model
{
    public function venue(){
        return $this->belongsTo('App\Venue');
    }
}
