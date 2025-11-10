<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ProgramResource;
use App\Models\Program;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ProgramController extends Controller
{
    public function index(Request $request)
    {
        $query = Program::with('sessions')->where('is_published', true);

        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title_ar', 'like', "%{$search}%")
                  ->orWhere('title_en', 'like', "%{$search}%");
            });
        }

        $programs = $query->orderBy('created_at', 'desc')->paginate($request->get('per_page', 15));

        return ProgramResource::collection($programs)->response();
    }

    public function store(Request $request)
    {
        $request->validate([
            'title_ar' => 'required|string|max:255',
            'title_en' => 'required|string|max:255',
        ]);

        $program = Program::create([
            'title_ar' => $request->title_ar,
            'title_en' => $request->title_en,
            'slug' => Str::slug($request->title_en),
            'description_ar' => $request->description_ar,
            'description_en' => $request->description_en,
            'content_ar' => $request->content_ar,
            'content_en' => $request->content_en,
            'created_by' => $request->user()->id,
            'is_published' => $request->boolean('is_published', false),
        ]);

        if ($request->has('sessions')) {
            foreach ($request->sessions as $index => $session) {
                $program->sessions()->create([
                    'title_ar' => $session['title_ar'] ?? '',
                    'title_en' => $session['title_en'] ?? '',
                    'description_ar' => $session['description_ar'] ?? null,
                    'description_en' => $session['description_en'] ?? null,
                    'content_ar' => $session['content_ar'] ?? null,
                    'content_en' => $session['content_en'] ?? null,
                    'order' => $index,
                ]);
            }
        }

        return (new ProgramResource($program->load('sessions')))
            ->response()
            ->setStatusCode(201);
    }

    public function show(Request $request, $id)
    {
        $program = Program::with('sessions', 'creator')->findOrFail($id);
        return new ProgramResource($program);
    }

    public function update(Request $request, $id)
    {
        $program = Program::findOrFail($id);
        $program->update($request->all());

        if ($request->has('sessions')) {
            $program->sessions()->delete();
            foreach ($request->sessions as $index => $session) {
                $program->sessions()->create([
                    'title_ar' => $session['title_ar'] ?? '',
                    'title_en' => $session['title_en'] ?? '',
                    'description_ar' => $session['description_ar'] ?? null,
                    'description_en' => $session['description_en'] ?? null,
                    'content_ar' => $session['content_ar'] ?? null,
                    'content_en' => $session['content_en'] ?? null,
                    'order' => $index,
                ]);
            }
        }

        return new ProgramResource($program->load('sessions'));
    }

    public function destroy($id)
    {
        $program = Program::findOrFail($id);
        $program->delete();

        return response()->json(['message' => 'Program deleted successfully']);
    }
}
