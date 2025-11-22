<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TherapistQualification extends Model
{
    use HasFactory;

    protected $fillable = [
        'therapist_id',
        'name_ar',
        'name_en',
        'institution_ar',
        'institution_en',
        'year'
    ];

    protected $casts = [
        'year' => 'integer',
    ];

    /**
     * العلاقة مع المعالج
     */
    public function therapist(): BelongsTo
    {
        return $this->belongsTo(Therapist::class);
    }

    /**
     * الحصول على اسم المؤهل حسب اللغة
     */
    public function getNameAttribute(): string
    {
        return app()->getLocale() === 'ar' ? $this->name_ar : $this->name_en;
    }

    /**
     * الحصول على اسم المؤسسة حسب اللغة
     */
    public function getInstitutionAttribute(): string
    {
        return app()->getLocale() === 'ar' ? $this->institution_ar : $this->institution_en;
    }
}