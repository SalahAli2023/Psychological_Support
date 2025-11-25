<?php
namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasApiTokens, HasFactory, Notifiable;
    
    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'phone',
        'avatar',
        'bio',
        'joined_at',
        'email_verification_code',
        'email_verified_at',
        'verification_code_expires_at',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
        'email_verification_code',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'joined_at' => 'datetime',
            'verification_code_expires_at' => 'datetime',
        ];
    }

    /**
     * Get the patient profile for this user.
     */
    public function patient(): HasOne
    {
        return $this->hasOne(Patient::class);
    }

    /**
     * Get the articles authored by this user.
     */
    public function articles()
    {
        return $this->hasMany(Article::class, 'author_id');
    }

    /**
     * Get the therapist profile for this user.
     */
    public function therapist()
    {
        return $this->hasOne(Therapist::class);
    }

    /**
     * Get the appointments for this user as a client.
     */
    public function clientAppointments()
    {
        return $this->hasMany(Appointment::class, 'client_id');
    }

    /**
     * Get the measure responses for this user.
     */
    public function measureResponses()
    {
        return $this->hasMany(MeasureResponse::class);
    }

    /**
     * Get the programs created by this user.
     */
    public function programs()
    {
        return $this->hasMany(Program::class, 'created_by');
    }

    public function assessments(): HasMany
    {
        return $this->hasMany(UserAssessment::class);
    }

    /**
     * Check if user is admin.
     */
    public function isAdmin(): bool
    {
        return $this->role === 'Admin';
    }

    /**
     * Check if user is therapist.
     */
    public function isTherapist(): bool
    {
        return $this->role === 'Therapist';
    }

    /**
     * Check if user is client.
     */
    public function isClient(): bool
    {
        return $this->role === 'Client';
    }

    /**
     * Check if email is verified.
     */
    public function isEmailVerified(): bool
    {
        return !is_null($this->email_verified_at);
    }

    /**
     * Check if verification code is valid.
     */
    public function isVerificationCodeValid(): bool
    {
        return $this->verification_code_expires_at && 
               $this->verification_code_expires_at->isFuture();
    }
}