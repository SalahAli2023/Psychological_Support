<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TherapistSchedule extends Model
{
    use HasFactory;

    protected $fillable = [
        'therapist_id',
        'day',
        'start_time',
        'end_time',
        'available',
        'recurrence',
        'slot_duration'
    ];

    protected $casts = [
        'start_time' => 'string',
        'end_time' => 'string',
        'available' => 'boolean',
        'slot_duration' => 'integer',
    ];

    /**
     * العلاقة مع المعالج
     */
    public function therapist(): BelongsTo
    {
        return $this->belongsTo(Therapist::class);
    }

    /**
     * التحقق إذا كان الموعد متاح
     */
    public function getIsAvailableAttribute(): bool
    {
        return $this->available;
    }

    /**
     * الحصول على مدة الجلسة بالدقائق
     */
    public function getSessionDurationAttribute(): int
    {
        return $this->slot_duration ?? $this->therapist->session_duration ?? 60;
    }
}