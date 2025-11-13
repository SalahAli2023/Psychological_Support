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
        Schema::create('scale_questions', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('scale_id')->constrained('psychological_scales')->onDelete('cascade');
            $table->text('question_text_ar');
            $table->text('question_text_en');
            $table->integer('question_order')->default(0);
            $table->timestamps();

            $table->index('scale_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('scale_questions');
    }
};
