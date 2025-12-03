<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\ContactRequest;
use App\Models\Contact;
use App\Http\Resources\ContactResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ContactController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Contact::query();
        
        // البحث
        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('subject', 'like', "%{$search}%");
            });
        }

        // التصفية حسب الحالة
        if ($request->has('status') && $request->status) {
            $query->where('status', $request->status);
        }
        
        // التصفية حسب نوع الرسالة
        if ($request->has('message_type') && $request->message_type) {
            $query->where('message_type', $request->message_type);
        }

        // // الترتيب
        $sort = $request->get('sort', 'created_at');
        $order = $request->get('order', 'desc');
        $query->orderBy($sort, $order);
        
        // $contacts = $query->paginate(20);
        $contacts = $query->latest()->paginate(20);
        
        return response()->json([
            'success' => true,
            'data' => ContactResource::collection($contacts),
            'pagination' => [
                'total' => $contacts->total(),
                'per_page' => $contacts->perPage(),
                'current_page' => $contacts->currentPage(),
                'last_page' => $contacts->lastPage(),
            ]
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(ContactRequest $request): JsonResponse
    {
        try {
            $contact = Contact::create($request->validated());
            
            // هنا يمكنك إضافة إرسال إشعار أو email
            // $this->sendNotification($contact);
            
            return response()->json([
                'success' => true,
                'message' => 'تم إرسال رسالتك بنجاح، وسنقوم بالرد عليك في أقرب وقت.',
                'data' => new ContactResource($contact)
            ], 201);
            
        } catch (\Exception $e) {
            \Log::error('Contact store error: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء إرسال الرسالة. يرجى المحاولة مرة أخرى.'
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Contact $contact): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => new ContactResource($contact)
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Contact $contact): JsonResponse
    {
        $request->validate([
            'status' => 'required|in:new,in_progress,resolved,closed',
            'admin_notes' => 'nullable|string'
        ]);

        $contact->update($request->only(['status', 'admin_notes']));

        return response()->json([
            'success' => true,
            'message' => 'تم تحديث حالة الرسالة بنجاح',
            'data' => new ContactResource($contact)
        ]);
    }

    /**
     * إحصائيات الاتصالات (للوحة التحكم)
     */
    public function statistics(): JsonResponse
    {
        $stats = [
            'total' => Contact::count(),
            'new' => Contact::where('status', 'new')->count(),
            'in_progress' => Contact::where('status', 'in_progress')->count(),
            'resolved' => Contact::where('status', 'resolved')->count(),
            'by_type' => Contact::groupBy('message_type')
                ->selectRaw('message_type, count(*) as count')
                ->get()
                ->pluck('count', 'message_type')
        ];

        return response()->json([
            'success' => true,
            'data' => $stats
        ]);
    }

    /**
     * دالة مساعدة لإرسال الإشعارات
     */
    private function sendNotification(Contact $contact)
    {
        // إرسال إشعار للمسؤول
        // Notification::send($adminUsers, new NewContactNotification($contact));
        
        // أو إرسال email
        // Mail::to(config('mail.admin_email'))->send(new ContactFormSubmitted($contact));
    }
    
    /**
     * Remove the specified resource from storage.
     */
    /**
     * حذف رسالة اتصال
     */
    public function destroy(Contact $contact): JsonResponse
    {
        try {
            $contact->delete();
            
            return response()->json([
                'success' => true,
                'message' => 'تم حذف الرسالة بنجاح'
            ]);
            
        } catch (\Exception $e) {
            \Log::error('Contact delete error: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء حذف الرسالة'
            ], 500);
        }
    }

    public function exportCsv()
    {
        $fileName = 'contacts_' . date('Y-m-d_H-i-s') . '.csv';
        $contacts = Contact::all();
        
        $headers = [
            "Content-type" => "text/csv",
            "Content-Disposition" => "attachment; filename=$fileName",
            "Pragma" => "no-cache",
            "Cache-Control" => "must-revalidate, post-check=0, pre-check=0",
            "Expires" => "0"
        ];
        
        $columns = ['ID', 'الاسم', 'البريد الإلكتروني', 'الهاتف', 'الموضوع', 'نوع الرسالة', 'الحالة', 'التاريخ'];
        
        $callback = function() use ($contacts, $columns) {
            $file = fopen('php://output', 'w');
            fputcsv($file, $columns);
            
            foreach ($contacts as $contact) {
                $row = [
                    $contact->id,
                    $contact->name,
                    $contact->email,
                    $contact->phone ?? 'N/A',
                    $contact->subject,
                    $this->getMessageTypeArabic($contact->message_type),
                    $this->getStatusArabic($contact->status),
                    $contact->created_at->format('Y-m-d H:i')
                ];
                
                fputcsv($file, $row);
            }
            
            fclose($file);
        };
        
        return response()->stream($callback, 200, $headers);
    }

    private function getMessageTypeArabic($type)
    {
        $types = [
            'inquiry' => 'استفسار',
            'complaint' => 'شكوى',
            'suggestion' => 'اقتراح',
            'support' => 'دعم فني',
            'other' => 'أخرى'
        ];
        
        return $types[$type] ?? $type;
    }

    private function getStatusArabic($status)
    {
        $statuses = [
            'new' => 'جديد',
            'in_progress' => 'قيد المعالجة',
            'resolved' => 'تم الحل',
            'closed' => 'مغلق'
        ];
        
        return $statuses[$status] ?? $status;
    }
}
