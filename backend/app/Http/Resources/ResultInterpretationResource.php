<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class ResultInterpretationResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'scale_id' => $this->scale_id,
            'min_score' => $this->min_score,
            'max_score' => $this->max_score,
            'interpretation_label' => $this->interpretation_label,
            'interpretation_label_ar' => $this->interpretation_label_ar,
            'interpretation_label_en' => $this->interpretation_label_en,
            'description' => $this->description,
            'description_ar' => $this->description_ar,
            'description_en' => $this->description_en,
            'color' => $this->color,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}