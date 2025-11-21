<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\ArticleController;
use App\Http\Controllers\Api\EventController;
use App\Http\Controllers\Api\TherapistController;
use App\Http\Controllers\Api\LibraryController;
use App\Http\Controllers\Api\MeasureController;
use App\Http\Controllers\Api\AppointmentController;
use App\Http\Controllers\Api\ProgramController;
use App\Http\Controllers\Api\LegalResourceController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\AssessmentController;
use App\Http\Controllers\Api\TherapistCertificationController;
use App\Http\Controllers\Api\TherapistQualificationController;
use App\Http\Controllers\Api\TherapistScheduleController;
use App\Http\Controllers\Api\PatientController;
use App\Http\Controllers\Api\PatientConditionController;
use App\Http\Controllers\Api\PatientSessionController;
use App\Http\Controllers\Api\ContactController;

use App\Http\Controllers\CategoryController;
use App\Http\Controllers\PsychologicalScaleController;
use App\Http\Controllers\FrontendScaleController;
use App\Http\Controllers\ScaleQuestionController;
use App\Http\Controllers\QuestionOptionController;
use App\Http\Controllers\ResultInterpretationController;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

    
// ==================== PUBLIC ROUTES ====================

// Authentication
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// 🔥 Frontend Authentication Routes
Route::prefix('frontend')->group(function () {
    Route::post('/register', [AuthController::class, 'frontendRegister']);
    Route::post('/login', [AuthController::class, 'frontendLogin']);
});

// 🔥 Frontend Scales Routes (بدون تسجيل دخول)
Route::prefix('frontend')->group(function () {
    Route::get('/scales', [FrontendScaleController::class, 'index']);
    Route::get('/scales/categories', [FrontendScaleController::class, 'categories']);
    Route::get('/scales/popular', [FrontendScaleController::class, 'popular']);
    Route::get('/scales/category/{categoryId}', [FrontendScaleController::class, 'byCategory']);
    Route::get('/scales/{id}', [FrontendScaleController::class, 'show']);
    Route::get('/scales/{id}/full', [FrontendScaleController::class, 'getFullScale']);
    
    // 🔥 NEW: مسار خاص للمستخدمين غير المسجلين
    Route::post('/scales/{id}/submit-public', [FrontendScaleController::class, 'submitTestPublic']);
});

// Articles
Route::get('/articles', [ArticleController::class, 'index']);
Route::get('/articles/{id}', [ArticleController::class, 'show']);
Route::get('/articles/categories/list', [ArticleController::class, 'categories']);

// Events
Route::get('/events', [EventController::class, 'index']);
Route::get('/events/{id}', [EventController::class, 'show']);

// Therapists
Route::get('/therapists', [TherapistController::class, 'index']);
Route::get('/therapists/{id}', [TherapistController::class, 'show']);
Route::get('/therapists/specializations/list', [TherapistController::class, 'specializations']);

// Library
Route::get('/library', [LibraryController::class, 'index']);
Route::get('/library/{id}', [LibraryController::class, 'show']);
Route::get('/library/categories/list', [LibraryController::class, 'categories']);
Route::get('/library/{id}/download', [LibraryController::class, 'incrementDownloads']);
Route::post('/library/{id}/rate', [LibraryController::class, 'rateItem']);
Route::get('/library/favorites', [LibraryController::class, 'favorites']);

// Legal Resources
Route::get('/legal-resources', [LegalResourceController::class, 'index']);
Route::get('/legal-resources/{id}', [LegalResourceController::class, 'show']);
Route::get('/legal-resources/categories', [LegalResourceController::class, 'categories']);
Route::get('/legal-resource-categories', [LegalResourceController::class, 'categories']);
Route::get('/legal-resources/search', [LegalResourceController::class, 'search']);

// ==================== PUBLIC PSYCHOLOGICAL SCALES ROUTES (للتوافق) ====================
Route::get('/psychological-scales/active/list', [PsychologicalScaleController::class, 'active']);
Route::get('/psychological-scales/category/{categoryId}', [PsychologicalScaleController::class, 'byCategory']);
Route::get('/psychological-scales/{id}/full', [PsychologicalScaleController::class, 'getFullScale']);

//public contacts route
Route::post('/contacts', [ContactController::class, 'store']);

// Protected routes
=======
// ==================== PROTECTED ROUTES ====================
Route::middleware('auth:sanctum')->group(function () {
    
    // ==================== AUTHENTICATION ====================
    Route::post('/logout', [AuthController::class, 'logout']);

    // Route::get('/user', [AuthController::class, 'user']);

    // Users routes
    Route::get('/users', [UserController::class, 'index']);
    Route::post('/users', [UserController::class, 'store']);
    Route::get('/users/{user}', [UserController::class, 'show']);
    Route::put('/users/{user}', [UserController::class, 'update']);
    Route::delete('/users/{user}', [UserController::class, 'destroy']);
    Route::get('/users/stats', [UserController::class, 'stats']);

    // Dashboard
    // 🔥 Frontend Protected Routes
    Route::prefix('frontend')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        
        // 🔥 MOVED: مسار submit الرئيسي أصبح محمياً للمستخدمين المسجلين
        Route::post('/scales/{id}/submit', [FrontendScaleController::class, 'submitTest']);
        
        // 🔥 NEW: حفظ النتيجة بعد تسجيل الدخول (للمستخدمين غير المسجلين سابقاً)
        Route::post('/scales/{id}/save-result', [FrontendScaleController::class, 'saveAssessmentResult']);
    });
    
    // ==================== DASHBOARD ====================
    Route::get('/dashboard/stats', [DashboardController::class, 'stats']);
    
    // ==================== USER MANAGEMENT ====================
    Route::get('/users', [UserController::class, 'index']);
    Route::post('/users', [UserController::class, 'store']);
    Route::get('/users/{user}', [UserController::class, 'show']);
    Route::put('/users/{user}', [UserController::class, 'update']);
    Route::delete('/users/{user}', [UserController::class, 'destroy']);
    Route::get('/users/stats', [UserController::class, 'stats']);
    
    // ==================== ARTICLES MANAGEMENT ====================
    Route::post('/articles', [ArticleController::class, 'store']);
    Route::put('/articles/{id}', [ArticleController::class, 'update']);
    Route::delete('/articles/{id}', [ArticleController::class, 'destroy']);
    Route::post('/articles/categories', [ArticleController::class, 'storeCategory']);
    Route::put('/articles/categories/{id}', [ArticleController::class, 'updateCategory']);
    Route::delete('/articles/categories/{id}', [ArticleController::class, 'destroyCategory']);
    
    // ==================== EVENTS MANAGEMENT ====================
    Route::post('/events', [EventController::class, 'store']);
    Route::put('/events/{id}', [EventController::class, 'update']);
    Route::delete('/events/{id}', [EventController::class, 'destroy']);

    
    // ==================== THERAPISTS MANAGEMENT ====================


    // Therapists routes
    Route::get('/therapists', [TherapistController::class, 'index']);
    Route::get('/therapists/{id}', [TherapistController::class, 'show']);

    Route::post('/therapists', [TherapistController::class, 'store']);
    Route::put('/therapists/{id}', [TherapistController::class, 'update']);
    Route::delete('/therapists/{id}', [TherapistController::class, 'destroy']);
    
    // Therapist Certifications
    Route::get('/therapists/{therapist}/certifications', [TherapistCertificationController::class, 'index']);
    Route::post('/therapists/{therapist}/certifications', [TherapistCertificationController::class, 'store']);
    Route::put('/therapists/{therapist}/certifications/{certification}', [TherapistCertificationController::class, 'update']);
    Route::delete('/therapists/{therapist}/certifications/{certification}', [TherapistCertificationController::class, 'destroy']);
    
    // Therapist Qualifications
    Route::get('/therapists/{therapist}/qualifications', [TherapistQualificationController::class, 'index']);
    Route::post('/therapists/{therapist}/qualifications', [TherapistQualificationController::class, 'store']);
    Route::put('/therapists/{therapist}/qualifications/{qualification}', [TherapistQualificationController::class, 'update']);
    Route::delete('/therapists/{therapist}/qualifications/{qualification}', [TherapistQualificationController::class, 'destroy']);
    
    // Therapist Schedules
    Route::get('/therapists/{therapist}/schedules', [TherapistScheduleController::class, 'index']);
    Route::post('/therapists/{therapist}/schedules', [TherapistScheduleController::class, 'store']);
    Route::put('/therapists/{therapist}/schedules/{schedule}', [TherapistScheduleController::class, 'update']);
    Route::delete('/therapists/{therapist}/schedules/{schedule}', [TherapistScheduleController::class, 'destroy']);
    
    // ==================== LIBRARY MANAGEMENT ====================
    Route::post('/library', [LibraryController::class, 'store']);
    Route::put('/library/{id}', [LibraryController::class, 'update']);
    Route::delete('/library/{id}', [LibraryController::class, 'destroy']);
    Route::delete('/library/categories/{id}', [LibraryController::class, 'destroyCategory']);
     // Library Categories Routes
    Route::get('/library/categories', [LibraryController::class, 'categoriesIndex']);
    Route::post('/library/categories', [LibraryController::class, 'storeCategory']);
    Route::put('/library/categories/{id}', [LibraryController::class, 'updateCategory']);
    Route::delete('/library/categories/{id}', [LibraryController::class, 'destroyCategory']);
    // Measures (admin only)
    Route::post('/measures', [MeasureController::class, 'store']);
    Route::put('/measures/{id}', [MeasureController::class, 'update']);
    Route::delete('/measures/{id}', [MeasureController::class, 'destroy']);

    // Appointments
    
    // ==================== APPOINTMENTS MANAGEMENT ====================
    Route::get('/appointments', [AppointmentController::class, 'index']);
    Route::post('/appointments', [AppointmentController::class, 'store']);
    Route::get('/appointments/{id}', [AppointmentController::class, 'show']);
    Route::put('/appointments/{id}', [AppointmentController::class, 'update']);
    Route::delete('/appointments/{id}', [AppointmentController::class, 'destroy']);
    
    // ==================== PROGRAMS MANAGEMENT ====================
    Route::get('/programs', [ProgramController::class, 'index']);
    Route::post('/programs', [ProgramController::class, 'store']);
    Route::get('/programs/{id}', [ProgramController::class, 'show']);
    Route::put('/programs/{id}', [ProgramController::class, 'update']);
    Route::delete('/programs/{id}', [ProgramController::class, 'destroy']);
    
    // ==================== LEGAL RESOURCES MANAGEMENT ====================
    Route::post('/legal-resources', [LegalResourceController::class, 'store']);
    Route::put('/legal-resources/{id}', [LegalResourceController::class, 'update']);
    Route::delete('/legal-resources/{id}', [LegalResourceController::class, 'destroy']);
    
    // ==================== PATIENT MANAGEMENT ====================
    Route::prefix('patients')->group(function () {
        // Patient Routes
        Route::get('/', [PatientController::class, 'index']);
        Route::get('/stats', [PatientController::class, 'getStats']);
        Route::get('/export', [PatientController::class, 'export']);
        Route::post('/', [PatientController::class, 'store']);
        Route::get('/{patient}', [PatientController::class, 'show']);
        Route::put('/{patient}', [PatientController::class, 'update']);
        Route::delete('/{patient}', [PatientController::class, 'destroy']);

        // Patient Conditions Routes
        Route::prefix('{patient}')->group(function () {
            Route::get('/conditions', [PatientConditionController::class, 'index']);
            Route::get('/conditions/stats', [PatientConditionController::class, 'getStats']);
            Route::get('/conditions/export', [PatientConditionController::class, 'export']);
            Route::post('/conditions', [PatientConditionController::class, 'store']);
            Route::post('/conditions/bulk-import', [PatientConditionController::class, 'bulkImport']);
            
            Route::prefix('conditions/{condition}')->group(function () {
                Route::get('/', [PatientConditionController::class, 'show']);
                Route::put('/', [PatientConditionController::class, 'update']);
                Route::delete('/', [PatientConditionController::class, 'destroy']);
                Route::patch('/toggle-status', [PatientConditionController::class, 'toggleStatus']);
            });

            // Patient Sessions Routes
            Route::prefix('sessions')->group(function () {
                Route::get('/', [PatientSessionController::class, 'index']);
                Route::get('/stats', [PatientSessionController::class, 'getStats']);
                Route::get('/available-slots', [PatientSessionController::class, 'getAvailableSlots']);
                Route::post('/', [PatientSessionController::class, 'store']);
                
                Route::prefix('{session}')->group(function () {
                    Route::get('/', [PatientSessionController::class, 'show']);
                    Route::put('/', [PatientSessionController::class, 'update']);
                    Route::delete('/', [PatientSessionController::class, 'destroy']);
                    Route::patch('/status', [PatientSessionController::class, 'updateStatus']);
                    Route::patch('/progress', [PatientSessionController::class, 'updateProgress']);
                    Route::post('/notes', [PatientSessionController::class, 'addNotes']);
                    Route::post('/report', [PatientSessionController::class, 'addReport']);
                    Route::post('/attachments', [PatientSessionController::class, 'uploadAttachments']);
                    Route::delete('/attachments/{attachment}', [PatientSessionController::class, 'deleteAttachment']);
                });
            });
        });
    });
    
    // ==================== ASSESSMENTS MANAGEMENT ====================
    Route::get('assessments', [AssessmentController::class, 'index']);
    Route::get('assessments/{id}', [AssessmentController::class, 'show']);
    Route::post('assessments', [AssessmentController::class, 'store']);
    Route::get('assessments/statistics', [AssessmentController::class, 'getUserStatistics']);
    Route::get('assessments/{id}/result', [AssessmentController::class, 'getAssessmentResult']);
    
    // ==================== PSYCHOLOGICAL SCALES MANAGEMENT ====================
    Route::apiResource('psychological-scales', PsychologicalScaleController::class);
    Route::patch('psychological-scales/{psychologicalScale}/toggle-status', [PsychologicalScaleController::class, 'toggleStatus']);
    Route::put('psychological-scales/{psychologicalScale}/full', [PsychologicalScaleController::class, 'updateFullScale']);

    // ==================== CATEGORIES MANAGEMENT ====================
    Route::apiResource('categories', CategoryController::class);
    Route::get('categories/active/list', [CategoryController::class, 'active']);
    Route::patch('categories/{category}/toggle-status', [CategoryController::class, 'toggleStatus']);

    // ==================== SCALE QUESTIONS MANAGEMENT ====================
    Route::apiResource('scale-questions', ScaleQuestionController::class);
    Route::post('scale-questions/bulk', [ScaleQuestionController::class, 'bulkStore']);
    Route::post('scale-questions/reorder', [ScaleQuestionController::class, 'reorder']);

    // ==================== QUESTION OPTIONS MANAGEMENT ====================
    Route::apiResource('question-options', QuestionOptionController::class);
    Route::post('question-options/bulk', [QuestionOptionController::class, 'bulkStore']);
    Route::post('question-options/reorder', [QuestionOptionController::class, 'reorder']);

    // ==================== RESULT INTERPRETATIONS MANAGEMENT ====================
    Route::apiResource('result-interpretations', ResultInterpretationController::class);
    Route::get('result-interpretations/scale/{scaleId}/score/{score}', [ResultInterpretationController::class, 'getInterpretation']);
    Route::post('result-interpretations/bulk', [ResultInterpretationController::class, 'bulkStore']);
  
    //contacts 
    Route::get('/contacts', [ContactController::class, 'index']);
    Route::get('/contacts/statistics', [ContactController::class, 'statistics']);
    Route::get('/contacts/{contact}', [ContactController::class, 'show']);
    Route::put('/contacts/{contact}', [ContactController::class, 'update']);
});
    
