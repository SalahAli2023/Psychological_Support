<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ArticleController;
use App\Http\Controllers\Api\EventController;
use App\Http\Controllers\Api\TherapistController;
use App\Http\Controllers\Api\LibraryController;
use App\Http\Controllers\Api\MeasureController;
use App\Http\Controllers\Api\AppointmentController;
use App\Http\Controllers\Api\ProgramController;
use App\Http\Controllers\Api\LegalResourceController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\ScaleCategoryController;
use App\Http\Controllers\Api\PsychologicalScaleController;
use App\Http\Controllers\Api\AssessmentController;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Public routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Public resource routes
Route::get('/articles', [ArticleController::class, 'index']);
Route::get('/articles/{id}', [ArticleController::class, 'show']);
Route::get('/articles/categories/list', [ArticleController::class, 'categories']);
// Route::get('/articles/categories', [ArticleController::class, 'categories']);
Route::get('/events', [EventController::class, 'index']);
Route::get('/events/{id}', [EventController::class, 'show']);

Route::get('/therapists', [TherapistController::class, 'index']);
Route::get('/therapists/{id}', [TherapistController::class, 'show']);
Route::get('/therapists/specializations/list', [TherapistController::class, 'specializations']);

Route::get('/library', [LibraryController::class, 'index']);
Route::get('/library/{id}', [LibraryController::class, 'show']);
Route::get('/library/categories/list', [LibraryController::class, 'categories']);
Route::get('/library/{id}/download', [LibraryController::class, 'incrementDownloads']);
Route::post('/library/{id}/rate', [LibraryController::class, 'rateItem']);
Route::get('/library/favorites', [LibraryController::class, 'favorites']);
Route::get('/legal-resources', [LegalResourceController::class, 'index']);
Route::get('/legal-resources/{id}', [LegalResourceController::class, 'show']);
Route::get('legal-resources/categories', [LegalResourceController::class, 'categories']);

Route::get('/measures', [MeasureController::class, 'index']);
Route::get('/measures/{id}', [MeasureController::class, 'show']);
Route::get('/measures/{id}/questions', [MeasureController::class, 'questions']);
Route::post('/measures/{id}/submit', [MeasureController::class, 'submit']);

Route::get('/legal-resource-categories', [LegalResourceController::class, 'categories']);
Route::get('/legal-resources/search', [LegalResourceController::class, 'search']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    // Auth routes
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);

    // Dashboard
    Route::get('/dashboard/stats', [DashboardController::class, 'stats']);

    // Articles (admin/author only)
    Route::post('/articles', [ArticleController::class, 'store']);
    Route::put('/articles/{id}', [ArticleController::class, 'update']);
    Route::delete('/articles/{id}', [ArticleController::class, 'destroy']);
    Route::post('/articles/categories', [ArticleController::class, 'storeCategory']);
    Route::put('/articles/categories/{id}', [ArticleController::class, 'updateCategory']);
    Route::delete('/articles/categories/{id}', [ArticleController::class, 'destroyCategory']);
    // Events (admin only)
    Route::post('/events', [EventController::class, 'store']);
    Route::put('/events/{id}', [EventController::class, 'update']);
    Route::delete('/events/{id}', [EventController::class, 'destroy']);

    // Therapists (admin only)
    Route::post('/therapists', [TherapistController::class, 'store']);
    Route::put('/therapists/{id}', [TherapistController::class, 'update']);
    Route::delete('/therapists/{id}', [TherapistController::class, 'destroy']);

    // Library (admin only)
     Route::post('/library', [LibraryController::class, 'store']);
    Route::put('/library/{id}', [LibraryController::class, 'update']);
    Route::delete('/library/{id}', [LibraryController::class, 'destroy']);

    // Measures (admin only)
    Route::post('/measures', [MeasureController::class, 'store']);
    Route::put('/measures/{id}', [MeasureController::class, 'update']);
    Route::delete('/measures/{id}', [MeasureController::class, 'destroy']);

    // Appointments
    Route::get('/appointments', [AppointmentController::class, 'index']);
    Route::post('/appointments', [AppointmentController::class, 'store']);
    Route::get('/appointments/{id}', [AppointmentController::class, 'show']);
    Route::put('/appointments/{id}', [AppointmentController::class, 'update']);
    Route::delete('/appointments/{id}', [AppointmentController::class, 'destroy']);

    // Programs (admin only)
    Route::get('/programs', [ProgramController::class, 'index']);
    Route::post('/programs', [ProgramController::class, 'store']);
    Route::get('/programs/{id}', [ProgramController::class, 'show']);
    Route::put('/programs/{id}', [ProgramController::class, 'update']);
    Route::delete('/programs/{id}', [ProgramController::class, 'destroy']);

    // Legal Resources (admin only)
    Route::post('/legal-resources', [LegalResourceController::class, 'store']);
    Route::put('/legal-resources/{id}', [LegalResourceController::class, 'update']);
    Route::delete('/legal-resources/{id}', [LegalResourceController::class, 'destroy']);
});

Route::middleware('auth:sanctum')->group(function () {
    // Scale Categories
    Route::get('categories', [ScaleCategoryController::class, 'index']);
    Route::get('categories/{id}', [ScaleCategoryController::class, 'show']);
    Route::get('categories/{id}/scales', [ScaleCategoryController::class, 'getScales']);
    
    // Psychological Scales
    Route::get('scales', [PsychologicalScaleController::class, 'index']);
    Route::get('scales/{id}', [PsychologicalScaleController::class, 'show']);
    Route::get('scales/{id}/questions', [PsychologicalScaleController::class, 'getQuestions']);
    
    // Assessments (تغطي التقييمات + النتائج)
    Route::get('assessments', [AssessmentController::class, 'index']);
    Route::get('assessments/{id}', [AssessmentController::class, 'show']);
    Route::post('assessments', [AssessmentController::class, 'store']);
    Route::get('assessments/statistics', [AssessmentController::class, 'getUserStatistics']);
    Route::get('assessments/{id}/result', [AssessmentController::class, 'getAssessmentResult']);
});

// Public routes
Route::get('public/categories', [ScaleCategoryController::class, 'index']);
Route::get('public/scales', [PsychologicalScaleController::class, 'index']);
