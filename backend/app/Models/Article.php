<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Article extends Model
{
    use HasFactory;

    protected $fillable = [
        'title_ar',
        'title_en',
        'slug',
        'excerpt_ar',
        'excerpt_en',
        'content_ar',
        'content_en',
        'introduction_ar',
        'introduction_en',
        'image',
        'category_id',
        'author_id',
        'attachments',
        'published_at',
        'is_published',
        'views',
    ];

    protected function casts(): array
    {
        return [
            'attachments' => 'array',
            'published_at' => 'date',
            'is_published' => 'boolean',
            'views' => 'integer',
        ];
    }

    /**
     * Boot the model.
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($article) {
            if (empty($article->slug)) {
                $article->slug = Str::slug($article->title_en ?? $article->title_ar);
            }
        });
    }

    /**
     * Get the category that owns the article.
     */
    public function category()
    {
        return $this->belongsTo(ArticleCategory::class, 'category_id');
    }

    /**
     * Get the author that owns the article.
     */
    public function author()
    {
        return $this->belongsTo(User::class, 'author_id');
    }
}
