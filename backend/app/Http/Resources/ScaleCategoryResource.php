<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ScaleCategoryResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'name_ar' => $this->name_ar,
            'name_en' => $this->name_en,
            'description' => $this->description,
            'description_ar' => $this->description_ar,
            'description_en' => $this->description_en,
            'color' => $this->color,
            'is_active' => $this->is_active,
            'scales_count' => $this->whenCounted('psychologicalScales'),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
