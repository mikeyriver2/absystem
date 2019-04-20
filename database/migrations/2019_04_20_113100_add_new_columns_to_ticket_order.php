<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddNewColumnsToTicketOrder extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('ticket_orders',function(Blueprint $table){
            $table->string('student_id')->nullable();
            $table->string('student_year_course')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('ticket_orders',function(Blueprint $table){
            $table->dropColumn('student_id');
            $table->dropColumn('student_year_course');
        });
    }
}
