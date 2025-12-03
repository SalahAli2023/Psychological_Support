<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\AppointmentResource;
use App\Models\Appointment;
use Illuminate\Http\Request;

class AppointmentController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $query = Appointment::with(['client', 'therapist']);

        if ($user->isClient()) {
            $query->where('client_id', $user->id);
        } elseif ($user->isTherapist() && $user->therapist) {
            $query->where('therapist_id', $user->therapist->id);
        }

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        $appointments = $query->orderBy('starts_at', 'desc')->paginate($request->get('per_page', 15));

        return AppointmentResource::collection($appointments)->response();
    }

    public function store(Request $request)
    {
        $request->validate([
            'therapist_id' => 'required|exists:therapists,id',
            'starts_at' => 'required|date|after:now',
        ]);

        $appointment = Appointment::create([
            'client_id' => $request->user()->id,
            'therapist_id' => $request->therapist_id,
            'starts_at' => $request->starts_at,
            'ends_at' => $request->ends_at,
            'status' => 'scheduled',
            'notes' => $request->notes,
        ]);

        return (new AppointmentResource($appointment->load(['client', 'therapist'])))
            ->response()
            ->setStatusCode(201);
    }

    public function show(Request $request, $id)
    {
        $appointment = Appointment::with(['client', 'therapist'])->findOrFail($id);
        return new AppointmentResource($appointment);
    }

    public function update(Request $request, $id)
    {
        $appointment = Appointment::findOrFail($id);

        $request->validate([
            'starts_at' => 'sometimes|date',
            'status' => 'sometimes|in:scheduled,completed,cancelled',
        ]);

        $appointment->update($request->all());

        return new AppointmentResource($appointment->load(['client', 'therapist']));
    }

    public function destroy($id)
    {
        $appointment = Appointment::findOrFail($id);
        $appointment->delete();

        return response()->json(['message' => 'Appointment deleted successfully']);
    }
}
