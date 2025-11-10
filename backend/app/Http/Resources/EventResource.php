<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class EventResource extends JsonResource
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
            'slug' => $this->slug,
            'type' => $this->type,
            'description' => $locale === 'ar' ? $this->description_ar : $this->description_en,
            'description_ar' => $this->description_ar,
            'description_en' => $this->description_en,
            'full_description' => $locale === 'ar' ? $this->full_description_ar : $this->full_description_en,
            'full_description_ar' => $this->full_description_ar,
            'full_description_en' => $this->full_description_en,
            'media' => $this->media ? asset('storage/' . $this->media) : null,
            'media_type' => $this->media_type,
            'date' => $this->date?->format('Y-m-d'),
            'duration' => $this->duration,
            'location' => $locale === 'ar' ? $this->location_ar : $this->location_en,
            'location_ar' => $this->location_ar,
            'location_en' => $this->location_en,
            'topics' => $locale === 'ar' ? $this->topics_ar : $this->topics_en,
            'topics_ar' => $this->topics_ar,
            'topics_en' => $this->topics_en,
            'speakers' => $this->speakers,
            'is_published' => $this->is_published,
            'created_at' => $this->created_at?->format('Y-m-d H:i:s'),
            'updated_at' => $this->updated_at?->format('Y-m-d H:i:s'),
        ];
    }
}
