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
        Schema::create('result_interpretations', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('scale_id')->constrained('psychological_scales')->onDelete('cascade');
            $table->integer('min_score');
            $table->integer('max_score');
            $table->string('interpretation_label_ar', 100);
            $table->string('interpretation_label_en', 100);
            $table->text('description_ar')->nullable();
            $table->text('description_en')->nullable();
            $table->string('color', 20)->nullable();
            $table->timestamps();

            $table->index('scale_id');
            $table->index(['min_score', 'max_score']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('result_interpretations');
    }
};
