<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateAuditsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('audits', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->string('url');
            $table->string('email');
            $table->string('title');
            $table->text('firstContentfulPaint');
            $table->text('speedIndex');
            $table->text('largestContentfulPaint');
            $table->text('totalBlockingTime');
            $table->text('cumulativeLayoutShift');
            $table->text('interactive');
            $table->string('performance');
            $table->unsignedInteger('project_id');
           
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('urls');
    }
}
