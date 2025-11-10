<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('measure_questions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('measure_id')->constrained('measures')->onDelete('cascade');
            $table->text('question_ar');
            $table->text('question_en');
            $table->integer('order')->default(0);
            $table->boolean('is_reverse_scored')->default(false);
            $table->timestamps();
        });

        Schema::create('measure_responses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('measure_id')->constrained('measures')->onDelete('cascade');
            $table->foreignId('user_id')->nullable()->constrained('users')->onDelete('set null');
            $table->json('answers'); // Store user answers
            $table->integer('total_score');
            $table->string('interpretation_level')->nullable();
            $table->text('interpretation_ar')->nullable();
            $table->text('interpretation_en')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('measure_responses');
        Schema::dropIfExists('measure_questions');
    }
};
