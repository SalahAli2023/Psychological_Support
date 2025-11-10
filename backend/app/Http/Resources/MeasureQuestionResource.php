<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MeasureQuestionResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $locale = $request->query('locale') ?? $request->header('Accept-Language', 'en');
        $locale = in_array($locale, ['ar', 'en']) ? $locale : 'en';

        return [
            'id' => $this->id,
            'question' => $locale === 'ar' ? $this->question_ar : $this->question_en,
            'question_ar' => $this->question_ar,
            'question_en' => $this->question_en,
            'order' => $this->order,
            'is_reverse_scored' => $this->is_reverse_scored,
        ];
    }
}
