<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ResultInterpretation extends Model
{
    use HasFactory;

    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'id',
        'scale_id',
        'min_score',
        'max_score',
        'interpretation_label_ar',
        'interpretation_label_en',
        'description_ar',
        'description_en',
        'color'
    ];

    public function psychologicalScale(): BelongsTo
    {
        return $this->belongsTo(PsychologicalScale::class, 'scale_id');
    }

    // Accessors
    public function getInterpretationLabelAttribute(): string
    {
        return app()->getLocale() === 'ar' ? $this->interpretation_label_ar : $this->interpretation_label_en;
    }

    public function getDescriptionAttribute(): ?string
    {
        return app()->getLocale() === 'ar' ? $this->description_ar : $this->description_en;
    }
}