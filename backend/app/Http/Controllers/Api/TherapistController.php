<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\TherapistResource;
use App\Http\Resources\SpecializationResource;
use App\Models\Therapist;
use App\Models\Specialization;
use Illuminate\Http\Request;

class TherapistController extends Controller
{
    public function index(Request $request)
    {
        $query = Therapist::with('specializations')->where('is_active', true);

        if ($request->has('specialization')) {
            $query->whereHas('specializations', function ($q) use ($request) {
                $q->where('key', $request->specialization);
            });
        }

        if ($request->has('gender')) {
            $query->where('gender', $request->gender);
        }

        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name_ar', 'like', "%{$search}%")
                  ->orWhere('name_en', 'like', "%{$search}%");
            });
        }

        $therapists = $query->paginate($request->get('per_page', 15));

        return TherapistResource::collection($therapists)->response();
    }

    public function show(Request $request, $id)
    {
        $therapist = Therapist::with('specializations', 'user')->findOrFail($id);
        return new TherapistResource($therapist);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name_ar' => 'required|string|max:255',
            'name_en' => 'required|string|max:255',
            'title_ar' => 'required|string|max:255',
            'title_en' => 'required|string|max:255',
            'user_id' => 'required|exists:users,id',
        ]);

        $therapist = Therapist::create($request->all());

        if ($request->has('specializations')) {
            $therapist->specializations()->sync($request->specializations);
        }

        return (new TherapistResource($therapist->load('specializations')))
            ->response()
            ->setStatusCode(201);
    }

    public function update(Request $request, $id)
    {
        $therapist = Therapist::findOrFail($id);
        $therapist->update($request->all());

        if ($request->has('specializations')) {
            $therapist->specializations()->sync($request->specializations);
        }

        return new TherapistResource($therapist->load('specializations'));
    }

    public function destroy($id)
    {
        $therapist = Therapist::findOrFail($id);
        $therapist->delete();

        return response()->json(['message' => 'Therapist deleted successfully']);
    }

    public function specializations(Request $request)
    {
        $specializations = Specialization::all();
        return SpecializationResource::collection($specializations)->response();
    }
}
