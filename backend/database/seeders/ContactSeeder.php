<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Contact;

class ContactSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $contacts = [
            [
                'name' => 'أحمد محمد',
                'email' => 'ahmed@example.com',
                'phone' => '+967711111111',
                'subject' => 'استفسار حول جلسات الدعم',
                'message_type' => 'inquiry',
                'message' => 'أرغب في معرفة المزيد عن جلسات الدعم النفسي المتاحة',
                'status' => 'new'
            ],
            [
                'name' => 'فاطمة علي',
                'email' => 'fatima@example.com', 
                'phone' => '+967722222222',
                'subject' => 'مشكلة في التسجيل',
                'message_type' => 'support',
                'message' => 'أواجه صعوبة في إنشاء حساب جديد على المنصة',
                'status' => 'in_progress'
            ],
            [
                'name' => 'خالد عبدالله',
                'email' => 'khaled@example.com',
                'phone' => '+967733333333',
                'subject' => 'اقتراح تحسين',
                'message_type' => 'suggestion', 
                'message' => 'أقترح إضافة خاصية المحادثة المباشرة مع الأخصائيين',
                'status' => 'resolved'
            ]
        ];

        foreach ($contacts as $contact) {
            Contact::create($contact);
        }
    }
}
