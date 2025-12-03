<?php

namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Mail;
use App\Mail\EmailVerificationMail;
use Carbon\Carbon;
use App\Http\Requests\EmailVerificationRequest;


class AuthController extends Controller
{
    /**
     * Register a new user.
     */
    public function register(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
            'phone' => 'required|string|max:20|unique:users',
            'country_code' => 'required|string|max:5',
            'role' => 'nullable|in:Admin,Therapist,Client',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'فشل في التسجيل',
                'errors' => $validator->errors()
            ], 422);
        }

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'phone' => $request->phone,
            'country_code' => $request->country_code,
            'role' => $request->role ?? 'Client',
            'joined_at' => now(),
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'تم إنشاء الحساب بنجاح',
            'data' => [
                'user' => new UserResource($user),
                'token' => $token,
            ]
        ], 201);
    }







 public function registerClint(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
            'phone' => 'required|string|max:20|unique:users',
            'country_code' => 'required|string|max:5',
            'role' => 'nullable|in:Admin,Therapist,Client',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'فشل في التسجيل',
                'errors' => $this->formatValidationErrors($validator)
            ], 422);
        }

        // إنشاء المستخدم
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'phone' => $request->phone,
            'country_code' => $request->country_code,
            'role' => $request->role ?? 'Client',
            'joined_at' => now(),
            'email_verification_code' => $this->generateVerificationCode(), // 🔥 NEW
            'verification_code_expires_at' => Carbon::now()->addHours(24), // 🔥 NEW
        ]);

        // إرسال رمز التحقق
        $this->sendCode($user);

        // $this->sendEmailVerification($user);

        return response()->json([
            'success' => true,
            'message' => 'تم إنشاء الحساب بنجاح. يرجى التحقق من بريدك الإلكتروني',
            'data' => [
                'user' => new UserResource($user),
                'requires_verification' => true, // 🔥 NEW
            ]
        ], 201);
    }

    /**
     * إرسال رمز التحقق
     */
    public function sendVerificationCode(Request $request): JsonResponse
{
    $validator = Validator::make($request->all(), [
        'email' => 'required|email|exists:users,email'
    ]);

    if ($validator->fails()) {
        return response()->json([
            'success' => false,
            'message' => 'البريد الإلكتروني غير صحيح'
        ], 422);
    }

    $user = User::where('email', $request->email)->first();

    // تحديث الرمز وتاريخ الانتهاء
    $user->update([
        'email_verification_code' => $this->generateVerificationCode(),
        'verification_code_expires_at' => Carbon::now()->addHours(24),
    ]);

    // إرسال الرمز
    $this->sendCode($user);


    return response()->json([
        'success' => true,
        'message' => 'تم إرسال رمز التحقق إلى بريدك الإلكتروني'
    ]);
}

private function sendCode(User $user)
{
    Mail::to($user->email)->send(
        new EmailVerificationMail($user)
    );
}


private function sendEmailVerification(User $user)
{
    Mail::to($user->email)->send(new EmailVerificationMail($user));
}
    /**
     * التحقق من الرمز
     */
    /**
 * التحقق من الرمز
 */
public function verifyEmail(EmailVerificationRequest $request): JsonResponse
{
    // استخدم verification_code مباشرة بدون merge
    $code = $request->verification_code ?? $request->code;
    
    $user = User::where('email', $request->email)->first();

    if (!$user) {
        return response()->json([
            'success' => false,
            'message' => 'المستخدم غير موجود'
        ], 404);
    }

    // التحقق إذا كان البريد مفعل بالفعل
    if ($user->isEmailVerified()) {
        return response()->json([
            'success' => false,
            'message' => 'البريد الإلكتروني مفعل بالفعل'
        ], 400);
    }
        
    // التحقق من صحة الرمز - استخدم المتغير $code
    if ($user->email_verification_code !== $code) {
        return response()->json([
            'success' => false,
            'message' => 'رمز التحقق غير صحيح'
        ], 422);
    }

    // التحقق من انتهاء صلاحية الرمز
    if (!$user->isVerificationCodeValid()) {
        return response()->json([
            'success' => false,
            'message' => 'رمز التحقق منتهي الصلاحية'
        ], 422);
    }

    // تفعيل الحساب
    $user->update([
        'email_verified_at' => now(),
        'email_verification_code' => null,
        'verification_code_expires_at' => null,
    ]);

    // إنشاء التوكن بعد التفعيل
    $token = $user->createToken('auth_token')->plainTextToken;

    return response()->json([
        'success' => true,
        'message' => 'تم تفعيل الحساب بنجاح',
        'data' => [
            'user' => new UserResource($user),
            'token' => $token,
        ]
    ]);
}
    /**
     * إعادة إرسال رمز التحقق
     */
    public function resendVerificationCode(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email|exists:users,email'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'البريد الإلكتروني غير صحيح'
            ], 422);
        }

        $user = User::where('email', $request->email)->first();

        if ($user->isEmailVerified()) {
            return response()->json([
                'success' => false,
                'message' => 'البريد الإلكتروني مفعل بالفعل'
            ], 400);
        }

        // تحديث الرمز
        $user->update([
            'email_verification_code' => $this->generateVerificationCode(),
            'verification_code_expires_at' => Carbon::now()->addHours(24),
        ]);

        // إرسال الرمز
        $this->sendCode($user);


        return response()->json([
            'success' => true,
            'message' => 'تم إرسال رمز التحقق إلى بريدك الإلكتروني'
        ]);
    }

    /**
     * توليد رمز تحقق مكون من 6 أرقام
     */
    private function generateVerificationCode(): string
    {
        return str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);
    }

  


    /**
     * Login user and create token.
     */
    public function login(Request $request): JsonResponse
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['البريد الإلكتروني أو كلمة المرور غير صحيحة.'],
            ]);
        }

        // للفرونتند: السماح للعملاء فقط
        if ($request->is('api/frontend/*') && !$user->isClient()) {
            return response()->json([
                'success' => false,
                'message' => 'غير مسموح بالدخول من هذه الواجهة'
            ], 403);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'تم تسجيل الدخول بنجاح',
            'data' => [
                'user' => new UserResource($user),
                'token' => $token,
            ]
        ]);
    }

    /**
     * Logout user (Revoke the token).
     */
    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'success' => true,
            'message' => 'تم تسجيل الخروج بنجاح',
        ]);
    }

    /**
     * Get authenticated user.
     */
    public function user(Request $request): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => [
                'user' => new UserResource($request->user())
            ]
        ]);
    }

    /**
     * تسجيل مستخدم من الفرونتند (بدون حاجة لتأكيد كلمة المرور)
     */
    public function frontendRegister(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'phone' => 'required|string|max:20|unique:users,phone',
            'country_code' => 'required|string|max:5',
            'password' => 'required|string|min:8',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'فشل في التسجيل',
                'errors' => $validator->errors()
            ], 422);
        }

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'phone' => $request->phone,
            'country_code' => $request->country_code,
            'password' => Hash::make($request->password),
            'role' => 'Client', // دائماً عميل من الفرونتند
            'joined_at' => now(),
        ]);

        $token = $user->createToken('frontend_token')->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'تم إنشاء الحساب بنجاح',
            'data' => [
                'user' => new UserResource($user),
                'token' => $token
            ]
        ], 201);
    }

    /**
     * تسجيل الدخول من الفرونتند
     */
    public function frontendLogin(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'بيانات الدخول غير صحيحة',
                'errors' => $validator->errors()
            ], 422);
        }

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'success' => false,
                'message' => 'البريد الإلكتروني أو كلمة المرور غير صحيحة'
            ], 401);
        }

        // السماح للعملاء فقط من الفرونتند
        if (!$user->isClient()) {
            return response()->json([
                'success' => false,
                'message' => 'غير مسموح بالدخول من هذه الواجهة'
            ], 403);
        }

        $token = $user->createToken('frontend_token')->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'تم تسجيل الدخول بنجاح',
            'data' => [
                'user' => new UserResource($user),
                'token' => $token
            ]
        ]);
    }


        /**
    * تنسيق الأخطاء للاستجابة
    */
    private function formatValidationErrors($validator)
    {
        $errors = $validator->errors()->toArray();
        $formattedErrors = [];
        
        foreach ($errors as $field => $messages) {
            $formattedErrors[$field] = $messages[0];
        }
        
        return $formattedErrors;
    }
}