<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class QuestionOption extends Model
{
    use HasFactory;

    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'id',
        'question_id',
        'option_text_ar',
        'option_text_en',
        'score_value',
        'option_order'
    ];

    public function question(): BelongsTo
    {
        return $this->belongsTo(ScaleQuestion::class);
    }

    // Accessor
    public function getOptionTextAttribute(): string
    {
        return app()->getLocale() === 'ar' ? $this->option_text_ar : $this->option_text_en;
    }
}