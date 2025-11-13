<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ScaleQuestionResource extends JsonResource
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
            'scale_id' => $this->scale_id,
            'question_text' => $this->question_text,
            'question_text_ar' => $this->question_text_ar,
            'question_text_en' => $this->question_text_en,
            'question_order' => $this->question_order,
            'options' => $this->whenLoaded('options', function () {
                return $this->options->map(function ($option) {
                    return [
                        'id' => $option->id,
                        'option_text' => $option->option_text,
                        'option_text_ar' => $option->option_text_ar,
                        'option_text_en' => $option->option_text_en,
                        'score_value' => $option->score_value,
                        'option_order' => $option->option_order,
                    ];
                });
            }),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
