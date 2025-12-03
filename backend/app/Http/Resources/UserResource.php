<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        // رابط الصورة الافتراضية
        $defaultAvatar = $this->getDefaultAvatarUrl();
        
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'role' => $this->role,
            'phone' => $this->phone,
            'avatar' => $this->avatar ? 
                asset('storage/' . $this->avatar) : 
                $defaultAvatar,
            'bio' => $this->bio,
            'joined_at' => $this->joined_at?->format('Y-m-d H:i:s'),
            'created_at' => $this->created_at?->format('Y-m-d H:i:s'),
            'updated_at' => $this->updated_at?->format('Y-m-d H:i:s'),
        ];
    }

    /**
     * الحصول على رابط الصورة الافتراضية بناءً على اسم المستخدم
     */
    private function getDefaultAvatarUrl()
    {
        // يمكنك استخدام خدمات مثل DiceBear أو إنشاء صورة افتراضية
        $name = urlencode($this->name ?: 'User');
        
        // استخدام DiceBear API لإنشاء صورة افتراضية
        return "https://api.dicebear.com/7.x/initials/svg?seed={$name}&backgroundColor=8FAE2F&textColor=ffffff";
        
        // أو يمكنك استخدام رابط محلي لصورة افتراضية
        // return asset('images/default-avatar.png');
        
        // أو إنشاء صورة باستخدام الحروف الأولى من الاسم
        // return $this->generateInitialsAvatar();
    }

    /**
     * إنشاء صورة افتراضية باستخدام الحروف الأولى (بدون استخدام API خارجي)
     */
    private function generateInitialsAvatar()
    {
        $initials = $this->getInitials();
        $backgroundColor = $this->getBackgroundColor();
        
        // يمكنك إنشاء SVG ديناميكي هنا أو استخدام صورة ثابتة
        return "data:image/svg+xml;utf8," . rawurlencode(
            '<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100">' .
            '<rect width="100" height="100" fill="' . $backgroundColor . '"/>' .
            '<text x="50" y="50" font-family="Arial, sans-serif" font-size="40" fill="white" text-anchor="middle" dy=".3em">' . $initials . '</text>' .
            '</svg>'
        );
    }

    /**
     * الحصول على الحروف الأولى من الاسم
     */
    private function getInitials()
    {
        if (!$this->name) {
            return 'U';
        }
        
        $names = explode(' ', $this->name);
        $initials = '';
        
        foreach ($names as $name) {
            if (isset($name[0])) {
                $initials .= strtoupper($name[0]);
            }
        }
        
        return substr($initials, 0, 2);
    }

    /**
     * الحصول على لون خلفية عشوائي بناءً على الاسم
     */
    private function getBackgroundColor()
    {
        $colors = [
            '#8FAE2F', // اللون الأساسي للتطبيق
            '#4F46E5', // أزرق
            '#DC2626', // أحمر
            '#059669', // أخضر
            '#7C3AED', // بنفسجي
            '#EA580C', // برتقالي
            '#0D9488', // تركواز
            '#9333EA', // أرجواني
        ];
        
        if (!$this->name) {
            return $colors[0];
        }
        
        $index = crc32($this->name) % count($colors);
        return $colors[$index];
    }
}