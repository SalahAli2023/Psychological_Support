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
        Schema::create('measures', function (Blueprint $table) {
            $table->id();
            $table->string('key')->unique();
            $table->string('title_ar');
            $table->string('title_en');
            $table->text('description_ar')->nullable();
            $table->text('description_en')->nullable();
            $table->enum('category', ['women', 'children'])->default('women');
            $table->string('icon')->nullable();
            $table->integer('questions_count')->default(0);
            $table->string('time_required')->nullable(); // e.g., "5-7"
            $table->decimal('rating', 3, 2)->default(0);
            $table->integer('reviews_count')->default(0);
            $table->json('options')->nullable(); // Store answer options
            $table->json('scores')->nullable(); // Store scoring rules
            $table->json('interpretation_rules')->nullable(); // Store interpretation logic
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('measures');
    }
};
