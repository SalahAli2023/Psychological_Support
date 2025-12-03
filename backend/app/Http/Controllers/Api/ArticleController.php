<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ArticleResource;
use App\Http\Resources\ArticleCategoryResource;
use App\Models\Article;
use App\Models\ArticleCategory;
use App\Models\Category;
use App\Models\ArticleAttachment;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ArticleController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Article::with(['category', 'scaleCategory', 'author', 'attachments']);

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
            'scale_category_id' => 'nullable|exists:categories,id',
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
            'scale_category_id' => $request->scale_category_id,
            'author_id' => $request->user()->id,
            'published_at' => $request->published_at ?? now(),
            'is_published' => $request->boolean('is_published', false),
        ]);

        // ✅ إصلاح: معالجة المرفقات بشكل صحيح
        if ($request->has('attachments') && !empty($request->attachments)) {
            $attachments = is_string($request->attachments) 
                ? json_decode($request->attachments, true) 
                : $request->attachments;
            
            if (is_array($attachments)) {
                foreach ($attachments as $attachment) {
                    $article->attachments()->create($attachment);
                }
            }
        }

        if ($request->hasFile('image')) {
            $article->image = $request->file('image')->store('articles', 'public');
            $article->save();
        }

        return (new ArticleResource($article->load(['category', 'author', 'attachments'])))
            ->response()
            ->setStatusCode(201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Request $request, $id)
    {
        // $article = Article::with(['category', 'author', 'attachments'])->findOrFail($id);
         $article = Article::with([
        'category', 
        'author', 
        'attachments',
        'scaleCategory'
     ])->findOrFail($id);
    
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
            'scale_category_id' => 'nullable|exists:categories,id',
            'image' => 'nullable|image|max:2048',
            'published_at' => 'nullable|date',
            'is_published' => 'boolean',
        ]);

        // Update slug if title_en or title_ar changed
        $updateData = $request->only([
            'title_ar', 'title_en', 'excerpt_ar', 'excerpt_en',
            'content_ar', 'content_en', 'introduction_ar', 'introduction_en',
            'category_id', 'scale_category_id', 'published_at', 'is_published'
        ]);

        // Update slug if title changed
        if ($request->has('title_en') && $request->title_en !== $article->title_en) {
            $updateData['slug'] = Str::slug($request->title_en);
        } elseif ($request->has('title_ar') && !$request->has('title_en') && $request->title_ar !== $article->title_ar) {
            $updateData['slug'] = Str::slug($request->title_ar);
        }

        $article->update($updateData);

        // ✅ إصلاح: معالجة المرفقات المحذوفة
        if ($request->has('deleted_attachments') && !empty($request->deleted_attachments)) {
            $deletedAttachments = is_string($request->deleted_attachments) 
                ? json_decode($request->deleted_attachments, true) 
                : $request->deleted_attachments;
            
            if (is_array($deletedAttachments)) {
                ArticleAttachment::whereIn('id', $deletedAttachments)
                    ->where('article_id', $article->id)
                    ->delete();
            }
        }

        // ✅ إصلاح: معالجة المرفقات الجديدة والمحدثة
        if ($request->has('attachments') && !empty($request->attachments)) {
            $attachments = is_string($request->attachments) 
                ? json_decode($request->attachments, true) 
                : $request->attachments;
            
            if (is_array($attachments)) {
                foreach ($attachments as $attachment) {
                    if (isset($attachment['id'])) {
                        // تحديث المرفق الموجود
                        $article->attachments()->where('id', $attachment['id'])->update([
                            'url' => $attachment['url'],
                            'type' => $attachment['type'],
                            'name' => $attachment['name'] ?? null,
                        ]);
                    } else {
                        // إنشاء مرفق جديد
                        $article->attachments()->create([
                            'url' => $attachment['url'],
                            'type' => $attachment['type'],
                            'name' => $attachment['name'] ?? null,
                        ]);
                    }
                }
            }
        }

        if ($request->hasFile('image')) {
            $article->image = $request->file('image')->store('articles', 'public');
            $article->save();
        }

        return new ArticleResource($article->load(['category', 'author', 'attachments']));
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

public function storeCategory(Request $request)
{
    $request->validate([
        'name_ar' => 'required|string|max:255',
        'name_en' => 'required|string|max:255',
        'color' => 'nullable|string|max:7',
        'description_ar' => 'nullable|string',
        'description_en' => 'nullable|string',
    ]);

    $category = ArticleCategory::create([
        'name_ar' => $request->name_ar,
        'name_en' => $request->name_en,
        'slug' => Str::slug($request->name_en),
        'color' => $request->color,
        'description_ar' => $request->description_ar,
        'description_en' => $request->description_en,
    ]);

    return new ArticleCategoryResource($category);
}

/**
 * Update the specified category.
 */
public function updateCategory(Request $request, $id)
{
    $category = ArticleCategory::findOrFail($id);

    $request->validate([
        'name_ar' => 'sometimes|string|max:255',
        'name_en' => 'sometimes|string|max:255',
        'color' => 'nullable|string|max:7',
        'description_ar' => 'nullable|string',
        'description_en' => 'nullable|string',
    ]);

    $updateData = $request->only([
        'name_ar', 'name_en', 'color', 'description_ar', 'description_en'
    ]);

    // Update slug if name_en changed
    if ($request->has('name_en') && $request->name_en !== $category->name_en) {
        $updateData['slug'] = Str::slug($request->name_en);
    }

    $category->update($updateData);

    return new ArticleCategoryResource($category);
}

/**
 * Remove the specified category.
 */
public function destroyCategory($id)
{
    $category = ArticleCategory::findOrFail($id);
    
    // Check if category has articles
    if ($category->articles()->count() > 0) {
        return response()->json([
            'message' => 'Cannot delete category with associated articles'
        ], 422);
    }
    
    $category->delete();

    return response()->json(['message' => 'Category deleted successfully']);
}
}
