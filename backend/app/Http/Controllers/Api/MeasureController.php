<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\MeasureResource;
use App\Http\Resources\MeasureQuestionResource;
use App\Models\Measure;
use App\Models\MeasureQuestion;
use App\Models\MeasureResponse;
use Illuminate\Http\Request;

class MeasureController extends Controller
{
    public function index(Request $request)
    {
        $query = Measure::with('questions')->where('is_active', true);

        if ($request->has('category')) {
            $query->where('category', $request->category);
        }

        $measures = $query->paginate($request->get('per_page', 15));

        return MeasureResource::collection($measures)->response();
    }

    public function show(Request $request, $id)
    {
        $measure = Measure::with('questions')->findOrFail($id);
        return new MeasureResource($measure);
    }

    public function questions(Request $request, $id)
    {
        $measure = Measure::with('questions')->findOrFail($id);
        return MeasureQuestionResource::collection($measure->questions)->response();
    }

    public function submit(Request $request, $id)
    {
        $measure = Measure::with('questions')->findOrFail($id);

        $request->validate([
            'answers' => 'required|array',
            'answers.*' => 'required|integer',
        ]);

        // Calculate total score
        $totalScore = 0;
        $answers = $request->answers;

        foreach ($measure->questions as $index => $question) {
            $answer = $answers[$index] ?? 0;
            $scores = $measure->scores ?? [0, 1, 2, 3];
            $score = $scores[$answer] ?? 0;

            if ($question->is_reverse_scored) {
                $score = max($scores) - $score;
            }

            $totalScore += $score;
        }

        // Get interpretation
        $interpretation = $this->getInterpretation($measure, $totalScore);

        $response = MeasureResponse::create([
            'measure_id' => $measure->id,
            'user_id' => $request->user()->id ?? null,
            'answers' => $answers,
            'total_score' => $totalScore,
            'interpretation_level' => $interpretation['level'],
            'interpretation_ar' => $interpretation['ar'],
            'interpretation_en' => $interpretation['en'],
        ]);

        return response()->json($response, 201);
    }

    private function getInterpretation($measure, $score)
    {
        $rules = $measure->interpretation_rules ?? [];
        // This is a simplified version - implement based on your interpretation rules
        return [
            'level' => 'moderate',
            'ar' => 'نتيجة متوسطة',
            'en' => 'Moderate result',
        ];
    }

    public function store(Request $request)
    {
        $request->validate([
            'key' => 'required|string|unique:measures,key',
            'title_ar' => 'required|string|max:255',
            'title_en' => 'required|string|max:255',
            'category' => 'required|in:women,children',
        ]);

        $measure = Measure::create($request->all());

        return (new MeasureResource($measure))
            ->response()
            ->setStatusCode(201);
    }

    public function update(Request $request, $id)
    {
        $measure = Measure::findOrFail($id);
        $measure->update($request->all());

        return new MeasureResource($measure);
    }

    public function destroy($id)
    {
        $measure = Measure::findOrFail($id);
        $measure->delete();

        return response()->json(['message' => 'Measure deleted successfully']);
    }
}
