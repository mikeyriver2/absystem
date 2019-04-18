<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class UserLog extends Model
{
    protected $fillable = ['user_id',"action"];

    public function user(){
        return $this->belongsTo('App\User');
    }
}
