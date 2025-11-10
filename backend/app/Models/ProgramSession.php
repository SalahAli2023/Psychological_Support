<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProgramSession extends Model
{
    use HasFactory;

    protected $fillable = [
        'program_id',
        'title_ar',
        'title_en',
        'description_ar',
        'description_en',
        'content_ar',
        'content_en',
        'order',
    ];

    protected function casts(): array
    {
        return [
            'order' => 'integer',
        ];
    }

    /**
     * Get the program that owns the session.
     */
    public function program()
    {
        return $this->belongsTo(Program::class);
    }
}
