<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Therapist extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'name_ar',
        'name_en',
        'title_ar',
        'title_en',
        'description_ar',
        'description_en',
        'image',
        'gender',
        'rating',
        'rating_count',
        'bio_ar',
        'bio_en',
        'whatsapp',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'rating' => 'decimal:2',
            'rating_count' => 'integer',
            'is_active' => 'boolean',
        ];
    }

    /**
     * Get the user that owns the therapist.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the specializations for the therapist.
     */
    public function specializations()
    {
        return $this->belongsToMany(Specialization::class, 'therapist_specializations');
    }

    /**
     * Get the appointments for the therapist.
     */
    public function appointments()
    {
        return $this->hasMany(Appointment::class);
    }
}
