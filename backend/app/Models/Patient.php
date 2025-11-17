<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Patient extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'date_of_birth',
        'gender',
        'address_ar',
        'address_en',
        'therapy_goals_ar',
        'therapy_goals_en',
        'status',
        'avatar_url'
    ];

    protected $casts = [
        'date_of_birth' => 'date',
    ];

    // العلاقات
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function conditions()
    {
        return $this->hasMany(PatientCondition::class);
    }

    // إزالة العلاقة sessions() أو إنشاؤها إذا كنت تحتاجها
    // public function sessions()
    // {
    //     return $this->hasMany(Session::class);
    // }

    // النطاقات (Scopes)
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    // السمات (Attributes)
    public function getAgeAttribute()
    {
        return $this->date_of_birth ? now()->diffInYears($this->date_of_birth) : null;
    }

    public function getAvatarAttribute()
    {
        return $this->avatar_url ?? $this->user->avatar;
    }
}