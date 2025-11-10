<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProgramSessionResource extends JsonResource
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
            'title' => $locale === 'ar' ? $this->title_ar : $this->title_en,
            'title_ar' => $this->title_ar,
            'title_en' => $this->title_en,
            'description' => $locale === 'ar' ? $this->description_ar : $this->description_en,
            'description_ar' => $this->description_ar,
            'description_en' => $this->description_en,
            'content' => $locale === 'ar' ? $this->content_ar : $this->content_en,
            'content_ar' => $this->content_ar,
            'content_en' => $this->content_en,
            'order' => $this->order,
            'program_id' => $this->program_id,
        ];
    }
}
