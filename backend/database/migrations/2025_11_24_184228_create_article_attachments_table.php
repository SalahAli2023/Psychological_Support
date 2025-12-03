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
        Schema::create('article_attachments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('article_id')->constrained()->onDelete('cascade');
            $table->string('url');
            $table->enum('type', ['file', 'image', 'video', 'audio', 'document', 'link']);
            $table->string('name')->nullable(); // اسم المرفق
            $table->integer('size')->nullable(); // حجم الملف
            $table->string('mime_type')->nullable(); // نوع الملف
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('article_attachments');
    }
};
