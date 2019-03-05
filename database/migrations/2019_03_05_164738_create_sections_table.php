<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateSectionsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('sections', function (Blueprint $table) {
            $table->increments('id');
            $table->timestamps();
            $table->string('type'); //ie: ground_floor / balcony etc... 
            $table->string('name'); //ie: ground_floor / balcony etc... 
            $table->unsignedInteger('venue_id')->foreign('venue_id')->references('id')->on('venues');
            $table->integer('number_of_rows');
            $table->integer('number_of_columns');
            $table->double('ticket_price');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('sections');
    }
}
