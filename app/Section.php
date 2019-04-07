<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Section extends Model
{
    protected $fillable = [];

    public function venue(){
        return $this->belongsTo('App\Venue');
    }

    public function section(){
        return $this->hasMany('App\Tickets');
    }

    public function getSpecialAttribute($value){
        if($value){
            return json_decode($value);
        }else{
            return null;
        }
    }
}
