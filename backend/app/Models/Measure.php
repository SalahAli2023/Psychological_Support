<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Measure extends Model
{
    use HasFactory;

    protected $fillable = [
        'key',
        'title_ar',
        'title_en',
        'description_ar',
        'description_en',
        'category',
        'icon',
        'questions_count',
        'time_required',
        'rating',
        'reviews_count',
        'options',
        'scores',
        'interpretation_rules',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'questions_count' => 'integer',
            'reviews_count' => 'integer',
            'rating' => 'decimal:2',
            'options' => 'array',
            'scores' => 'array',
            'interpretation_rules' => 'array',
            'is_active' => 'boolean',
        ];
    }

    /**
     * Get the questions for the measure.
     */
    public function questions()
    {
        return $this->hasMany(MeasureQuestion::class)->orderBy('order');
    }

    /**
     * Get the responses for the measure.
     */
    public function responses()
    {
        return $this->hasMany(MeasureResponse::class);
    }
}
