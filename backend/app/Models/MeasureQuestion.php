<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MeasureQuestion extends Model
{
    use HasFactory;

    protected $fillable = [
        'measure_id',
        'question_ar',
        'question_en',
        'order',
        'is_reverse_scored',
    ];

    protected function casts(): array
    {
        return [
            'order' => 'integer',
            'is_reverse_scored' => 'boolean',
        ];
    }

    /**
     * Get the measure that owns the question.
     */
    public function measure()
    {
        return $this->belongsTo(Measure::class);
    }
}
