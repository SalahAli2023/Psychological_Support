<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\LibraryItemResource;
use App\Http\Resources\LibraryCategoryResource;
use App\Models\LibraryItem;
use App\Models\LibraryCategory;
use Illuminate\Http\Request;

class LibraryController extends Controller
{
   public function index(Request $request)
{
    $perPage = $request->get('per_page', 15);
    
    $query = LibraryItem::with('category')->where('is_published', true);

    if ($request->has('category_id')) {
        $query->where('category_id', $request->category_id);
    }

    if ($request->has('type')) {
        $query->where('type', $request->type);
    }

    if ($request->has('search')) {
        $search = $request->search;
        $query->where(function ($q) use ($search) {
            $q->where('title_ar', 'like', "%{$search}%")
              ->orWhere('title_en', 'like', "%{$search}%");
        });
    }

    $items = $query->orderBy('created_at', 'desc')->paginate($perPage);

    return LibraryItemResource::collection($items);
}

    public function show(Request $request, $id)
    {
        $item = LibraryItem::with('category')->findOrFail($id);
        $item->increment('views');
        return new LibraryItemResource($item);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title_ar' => 'required|string|max:255',
            'title_en' => 'required|string|max:255',
            'type' => 'required|in:book,research,guide,article',
            'category_id' => 'required|exists:library_categories,id',
        ]);

        $item = LibraryItem::create($request->all());

        if ($request->hasFile('cover_image')) {
            $item->cover_image = $request->file('cover_image')->store('library', 'public');
            $item->save();
        }

        if ($request->hasFile('file')) {
            $item->file_path = $request->file('file')->store('library/files', 'public');
            $item->file_size = $request->file('file')->getSize();
            $item->save();
        }

        return (new LibraryItemResource($item->load('category')))
            ->response()
            ->setStatusCode(201);
    }

    public function update(Request $request, $id)
    {
        $item = LibraryItem::findOrFail($id);
        $item->update($request->all());

        if ($request->hasFile('cover_image')) {
            $item->cover_image = $request->file('cover_image')->store('library', 'public');
            $item->save();
        }

        if ($request->hasFile('file')) {
            $item->file_path = $request->file('file')->store('library/files', 'public');
            $item->file_size = $request->file('file')->getSize();
            $item->save();
        }

        return new LibraryItemResource($item->load('category'));
    }

    public function destroy($id)
    {
        $item = LibraryItem::findOrFail($id);
        $item->delete();

        return response()->json(['message' => 'Library item deleted successfully']);
    }

    public function categories(Request $request)
    {
        $categories = LibraryCategory::all();
        return LibraryCategoryResource::collection($categories)->response();
    }


    // إضافة إلى LibraryController.php

// زيادة التحميلات
public function incrementDownloads($id)
{
    $item = LibraryItem::findOrFail($id);
    $item->increment('downloads');
    return response()->json(['message' => 'Download count incremented']);
}

// إضافة تقييم
public function rateItem(Request $request, $id)
{
    $request->validate([
        'rating' => 'required|numeric|min:1|max:5'
    ]);

    $item = LibraryItem::findOrFail($id);
    
    // حساب التقييم الجديد
    $newRatingCount = $item->rating_count + 1;
    $newRating = (($item->rating * $item->rating_count) + $request->rating) / $newRatingCount;
    
    $item->update([
        'rating' => $newRating,
        'rating_count' => $newRatingCount
    ]);

    return new LibraryItemResource($item);
}

// جلب المفضلة
public function favorites(Request $request)
{
    $favoriteIds = $request->get('ids', []);
    
    if (empty($favoriteIds)) {
        return LibraryItemResource::collection(collect());
    }

    $items = LibraryItem::whereIn('id', $favoriteIds)
        ->where('is_published', true)
        ->get();

    return LibraryItemResource::collection($items);
}








public function categoriesIndex(Request $request)
{
    $perPage = $request->get('per_page', 15);
    
    $query = LibraryCategory::withCount('libraryItems');

    if ($request->has('search')) {
        $search = $request->search;
        $query->where(function ($q) use ($search) {
            $q->where('name_ar', 'like', "%{$search}%")
              ->orWhere('name_en', 'like', "%{$search}%")
              ->orWhere('key', 'like', "%{$search}%");
        });
    }

    // Sorting
    if ($request->has('sort')) {
        switch ($request->sort) {
            case 'name_asc':
                $query->orderBy('name_ar', 'asc');
                break;
            case 'name_desc':
                $query->orderBy('name_ar', 'desc');
                break;
            case 'newest':
                $query->orderBy('created_at', 'desc');
                break;
            case 'oldest':
                $query->orderBy('created_at', 'asc');
                break;
            case 'items_count':
                $query->orderBy('library_items_count', 'desc');
                break;
            default:
                $query->orderBy('created_at', 'desc');
        }
    } else {
        $query->orderBy('created_at', 'desc');
    }

    $categories = $query->paginate($perPage);

    return LibraryCategoryResource::collection($categories);
}

public function storeCategory(Request $request)
{
    $request->validate([
        'name_ar' => 'required|string|max:255',
        'name_en' => 'required|string|max:255',
        'key' => 'required|string|max:255|unique:library_categories,key',
        'color' => 'required|string|max:7',
    ]);

    $category = LibraryCategory::create($request->all());

    return (new LibraryCategoryResource($category))
        ->response()
        ->setStatusCode(201);
}

public function updateCategory(Request $request, $id)
{
    $category = LibraryCategory::findOrFail($id);
    
    $request->validate([
        'name_ar' => 'required|string|max:255',
        'name_en' => 'required|string|max:255',
        'key' => 'required|string|max:255|unique:library_categories,key,' . $id,
        'color' => 'required|string|max:7',
    ]);

    $category->update($request->all());

    return new LibraryCategoryResource($category);
}

public function destroyCategory($id)
{
    $category = LibraryCategory::findOrFail($id);
    
    // Check if category has items
    if ($category->libraryItems()->count() > 0) {
        return response()->json([
            'message' => 'Cannot delete category that has library items'
        ], 422);
    }
    
    $category->delete();

    return response()->json(['message' => 'Category deleted successfully']);
}










}
