<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ArticleResource;
use App\Http\Resources\ArticleCategoryResource;
use App\Models\Article;
use App\Models\ArticleCategory;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ArticleController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Article::with(['category', 'author']);

        // Filter by category
        if ($request->has('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        // Filter by published status
        if ($request->has('is_published')) {
            $query->where('is_published', $request->boolean('is_published'));
        }

        // Search
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title_ar', 'like', "%{$search}%")
                  ->orWhere('title_en', 'like', "%{$search}%")
                  ->orWhere('excerpt_ar', 'like', "%{$search}%")
                  ->orWhere('excerpt_en', 'like', "%{$search}%");
            });
        }

        // Language-based title
        $locale = $request->get('locale', 'en');
        $titleField = $locale === 'ar' ? 'title_ar' : 'title_en';

        $articles = $query->orderBy('published_at', 'desc')
            ->paginate($request->get('per_page', 15));

        return ArticleResource::collection($articles)->response();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'title_ar' => 'required|string|max:255',
            'title_en' => 'required|string|max:255',
            'excerpt_ar' => 'required|string',
            'excerpt_en' => 'required|string',
            'content_ar' => 'required|string',
            'content_en' => 'required|string',
            'category_id' => 'required|exists:article_categories,id',
            'image' => 'nullable|image|max:2048',
            'published_at' => 'nullable|date',
            'is_published' => 'boolean',
        ]);

        $article = Article::create([
            'title_ar' => $request->title_ar,
            'title_en' => $request->title_en,
            'slug' => Str::slug($request->title_en),
            'excerpt_ar' => $request->excerpt_ar,
            'excerpt_en' => $request->excerpt_en,
            'content_ar' => $request->content_ar,
            'content_en' => $request->content_en,
            'introduction_ar' => $request->introduction_ar,
            'introduction_en' => $request->introduction_en,
            'category_id' => $request->category_id,
            'author_id' => $request->user()->id,
            'published_at' => $request->published_at ?? now(),
            'is_published' => $request->boolean('is_published', false),
            'attachments' => $request->attachments,
        ]);

        if ($request->hasFile('image')) {
            $article->image = $request->file('image')->store('articles', 'public');
            $article->save();
        }

        return (new ArticleResource($article->load(['category', 'author'])))
            ->response()
            ->setStatusCode(201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Request $request, $id)
    {
        $article = Article::with(['category', 'author'])->findOrFail($id);
        
        // Increment views
        $article->increment('views');
        
        return new ArticleResource($article);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $article = Article::findOrFail($id);

        $request->validate([
            'title_ar' => 'sometimes|string|max:255',
            'title_en' => 'sometimes|string|max:255',
            'excerpt_ar' => 'sometimes|string',
            'excerpt_en' => 'sometimes|string',
            'content_ar' => 'sometimes|string',
            'content_en' => 'sometimes|string',
            'category_id' => 'sometimes|exists:article_categories,id',
            'image' => 'nullable|image|max:2048',
            'published_at' => 'nullable|date',
            'is_published' => 'boolean',
        ]);

        // Update slug if title_en or title_ar changed
        $updateData = $request->only([
            'title_ar', 'title_en', 'excerpt_ar', 'excerpt_en',
            'content_ar', 'content_en', 'introduction_ar', 'introduction_en',
            'category_id', 'published_at', 'is_published', 'attachments'
        ]);

        // Update slug if title changed
        if ($request->has('title_en') && $request->title_en !== $article->title_en) {
            $updateData['slug'] = Str::slug($request->title_en);
        } elseif ($request->has('title_ar') && !$request->has('title_en') && $request->title_ar !== $article->title_ar) {
            // If only title_ar changed and title_en doesn't exist, use title_ar for slug
            $updateData['slug'] = Str::slug($request->title_ar);
        }

        $article->update($updateData);

        if ($request->hasFile('image')) {
            $article->image = $request->file('image')->store('articles', 'public');
            $article->save();
        }

        return new ArticleResource($article->load(['category', 'author']));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $article = Article::findOrFail($id);
        $article->delete();

        return response()->json(['message' => 'Article deleted successfully']);
    }

    /**
     * Get article categories.
     */
    public function categories(Request $request)
    {
        $categories = ArticleCategory::all();
        return ArticleCategoryResource::collection($categories)->response();
    }

    public function categoriesList(Request $request)
{
    $categories = ArticleCategory::all();
    return ArticleCategoryResource::collection($categories);
}
}
