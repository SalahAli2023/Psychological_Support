<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class ScaleQuestionResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'scale_id' => $this->scale_id,
            'question_text' => $this->question_text,
            'question_text_ar' => $this->question_text_ar,
            'question_text_en' => $this->question_text_en,
            'question_order' => $this->question_order,
            'options' => QuestionOptionResource::collection($this->whenLoaded('options')),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}