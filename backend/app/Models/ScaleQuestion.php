<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ScaleQuestion extends Model
{
    use HasFactory;

    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'id',
        'scale_id',
        'question_text_ar',
        'question_text_en',
        'question_order'
    ];

    public function psychologicalScale(): BelongsTo
    {
        return $this->belongsTo(PsychologicalScale::class, 'scale_id');
    }

    public function options(): HasMany
    {
        return $this->hasMany(QuestionOption::class, 'question_id');
        // return $this->hasMany(QuestionOption::class)->orderBy('option_order');
    }

    // Accessor
    public function getQuestionTextAttribute(): string
    {
        return app()->getLocale() === 'ar' ? $this->question_text_ar : $this->question_text_en;
    }
}
