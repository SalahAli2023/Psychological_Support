<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ArticleResource extends JsonResource
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
            'excerpt' => $locale === 'ar' ? $this->excerpt_ar : $this->excerpt_en,
            'excerpt_ar' => $this->excerpt_ar,
            'excerpt_en' => $this->excerpt_en,
            'content' => $locale === 'ar' ? $this->content_ar : $this->content_en,
            'content_ar' => $this->content_ar,
            'content_en' => $this->content_en,
            'introduction' => $locale === 'ar' ? $this->introduction_ar : $this->introduction_en,
            'introduction_ar' => $this->introduction_ar,
            'introduction_en' => $this->introduction_en,
            'image' => $this->image ? asset('storage/' . $this->image) : null,
            'category' => new ArticleCategoryResource($this->whenLoaded('category')),
            'scale_category' => new CategoryResource($this->whenLoaded('scaleCategory')),
            'author' => new UserResource($this->whenLoaded('author')),
            'attachments' => ArticleAttachmentResource::collection($this->whenLoaded('attachments')),
            'category_id' => $this->category_id,
            'scale_category_id' => $this->scale_category_id,
            'author_id' => $this->author_id,
            'published_at' => $this->published_at?->format('Y-m-d'),
            'is_published' => $this->is_published,
            'views' => $this->views,
            'created_at' => $this->created_at?->format('Y-m-d H:i:s'),
            'updated_at' => $this->updated_at?->format('Y-m-d H:i:s'),
        ];
    }
}
