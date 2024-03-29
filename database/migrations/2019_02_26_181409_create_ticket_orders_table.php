<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTicketOrdersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('ticket_orders', function (Blueprint $table) {
            $table->increments('id');
            $table->timestamps();
            $table->string('buyer_first_name');
            $table->string('buyer_last_name');
            $table->string('buyer_email')->nullable();
            $table->string('buyer_cell_number')->nullable();
            $table->string('student_id_number')->nullable();
            $table->string('year_course')->nullable();
            $table->unsignedInteger('event_id')->foreign('event_id')->references('id')->on('events');
            $table->unsignedInteger('event_day_id')->foreign('event_day_id')->references('id')->on('event_days');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('ticket_orders');
    }
}
