<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class EmailVerificationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'email' => 'required|email|exists:users,email',
            'verification_code' => 'required|string|size:6'
        ];
    }

    public function messages(): array
    {
        return [
            'email.required' => 'البريد الإلكتروني مطلوب',
            'email.email' => 'صيغة البريد الإلكتروني غير صحيحة',
            'email.exists' => 'البريد الإلكتروني غير مسجل',
            'verification_code.required' => 'رمز التحقق مطلوب',
            'verification_code.size' => 'رمز التحقق يجب أن يكون 6 أرقام'
          
        ];
    }
}