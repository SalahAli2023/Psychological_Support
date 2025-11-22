<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Therapist extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'name_ar',
        'name_en',
        'title_ar',
        'title_en',
        'methodologies_ar',
        'methodologies_en',
        'specialty_ar',
        'specialty_en',
        'session_duration',
        'experience',
        'total_sessions',
        'hourly_rate',
        'phone',
        'date_of_birth',
        'gender',
        'rating',
        'rating_count',
        'bio_ar',
        'bio_en',
        'status'
    ];

    protected $casts = [
        'methodologies_ar' => 'array',
        'methodologies_en' => 'array',
        'date_of_birth' => 'date',
        'hourly_rate' => 'decimal:2',
        'rating' => 'decimal:2',
        'experience' => 'integer',
        'total_sessions' => 'integer',
        'session_duration' => 'integer',
        'rating_count' => 'integer',
    ];

    /**
     * العلاقة مع المستخدم
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * العلاقة مع المؤهلات
     */
    public function qualifications(): HasMany
    {
        return $this->hasMany(TherapistQualification::class);
    }

    /**
     * العلاقة مع الشهادات
     */
    public function certifications(): HasMany
    {
        return $this->hasMany(TherapistCertification::class);
    }

    /**
     * العلاقة مع الجداول الزمنية
     */
    public function schedules(): HasMany
    {
        return $this->hasMany(TherapistSchedule::class);
    }

    /**
     * الحصول على الاسم حسب اللغة
     */
    public function getNameAttribute(): string
    {
        return app()->getLocale() === 'ar' ? $this->name_ar : $this->name_en;
    }

    /**
     * الحصول على التخصص حسب اللغة
     */
    public function getSpecialtyAttribute(): string
    {
        return app()->getLocale() === 'ar' ? $this->specialty_ar : $this->specialty_en;
    }

    /**
     * التحقق إذا كان المعالج نشط
     */
    public function getIsActiveAttribute(): bool
    {
        return $this->status === 'active';
    }
}