<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ArticleAttachment extends Model
{
    use HasFactory;

    protected $fillable = [
        'article_id',
        'url',
        'type',
        'name',
        'size',
        'mime_type'
    ];

    // أنواع المرفقات المسموحة
    const TYPES = ['file', 'image', 'video', 'audio', 'document', 'link'];

    public function article()
    {
        return $this->belongsTo(Article::class);
    }
}