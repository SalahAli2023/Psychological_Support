<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MeasureResponse extends Model
{
    use HasFactory;

    protected $fillable = [
        'measure_id',
        'user_id',
        'answers',
        'total_score',
        'interpretation_level',
        'interpretation_ar',
        'interpretation_en',
    ];

    protected function casts(): array
    {
        return [
            'answers' => 'array',
            'total_score' => 'integer',
        ];
    }

    /**
     * Get the measure that owns the response.
     */
    public function measure()
    {
        return $this->belongsTo(Measure::class);
    }

    /**
     * Get the user that owns the response.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
