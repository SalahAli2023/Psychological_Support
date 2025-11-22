<?php

namespace App\Mail;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class EmailVerificationMail extends Mailable
{
    use Queueable, SerializesModels;

    public $user;
    public $verificationCode;
    public $appName;

    /**
     * Create a new message instance.
     */
    public function __construct(User $user)
    {
        $this->user = $user;
        $this->verificationCode = $user->email_verification_code;
        $this->appName = config('app.name');
    }

    /**
     * Build the message.
     */
    public function build(): self
    {
        return $this->subject('تفعيل حسابك - ' . $this->appName)
                    ->html($this->buildEmailContent());
    }

    /**
     * بناء محتوى البريد الإلكتروني
     */
   private function buildEmailContent(): string
{
    return "
    <!DOCTYPE html>
    <html dir='rtl'>
    <head>
        <meta charset='utf-8'>
        <meta name='viewport' content='width=device-width, initial-scale=1'>
        <title>تفعيل البريد الإلكتروني</title>
        <style>
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                line-height: 1.6;
                background-color: #f4f4f4;
                margin: 0;
                padding: 20px;
            }
            .container {
                max-width: 600px;
                margin: 0 auto;
                background: #ffffff;
                border-radius: 10px;
                overflow: hidden;
                box-shadow: 0 0 20px rgba(0,0,0,0.1);
            }
            .header {
                background: linear-gradient(135deg, #9EBF3B 0%, #D6A29A 100%);
                color: white;
                padding: 30px;
                text-align: center;
            }
            .content {
                padding: 40px;
            }
            .verification-code {
                background: #f8f9fa;
                border: 2px dashed #dee2e6;
                border-radius: 8px;
                padding: 20px;
                text-align: center;
                margin: 30px 0;
                font-size: 32px;
                font-weight: bold;
                color: #495057;
                letter-spacing: 5px;
            }
            .footer {
                background: #f8f9fa;
                padding: 20px;
                text-align: center;
                color: #6c757d;
                font-size: 14px;
            }
            .note {
                background: #e7f3ff;
                border: 1px solid #1F2937;
                border-radius: 5px;
                padding: 15px;
                margin: 20px 0;
                font-size: 14px;
            }
        </style>
    </head>
    <body>
        <div class='container'>
            <div class='header'>
                <h1>تفعيل البريد الإلكتروني</h1>
                <p>مرحباً {$this->user->name}،</p>
            </div>

            <div class='content'>
                <p>شكراً لتسجيلك في <strong>{$this->appName}</strong>.</p>
                <p>لتفعيل حسابك، يرجى استخدام رمز التحقق التالي:</p>

                <div class='verification-code'>
                    {$this->verificationCode}
                </div>

                <div class='note'>
                    <strong>ملاحظة:</strong>
                    <ul style='text-align: right; margin: 10px 0; padding-right: 20px;'>
                        <li>هذا الرمز صالح لمدة 24 ساعة</li>
                        <li>لا تشارك هذا الرمز مع أي شخص</li>
                        <li>إذا لم تطلب هذا الرمز، يرجى تجاهل هذه الرسالة</li>
                    </ul>
                </div>

                <p>إذا واجهتك أي مشكلة، لا تتردد في التواصل مع فريق الدعم.</p>
            </div>

            <div class='footer'>
                <p>&copy; " . date('Y') . " {$this->appName}. جميع الحقوق محفوظة❤️.</p>
            </div>
        </div>
    </body>
    </html>
    ";
}

}