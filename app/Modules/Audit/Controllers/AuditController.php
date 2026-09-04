<?php

namespace App\Modules\Audit\Controllers;

use App\Modules\Audit\Models\AuditLog;
use App\Shared\BaseController;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AuditController extends BaseController
{
    public function index(Request $request): Response
    {
        abort_unless(auth()->user()->can('audit.view'), 403);

        $logs = AuditLog::query()
            ->with('user:id,name,avatar')
            ->when(
                $request->input('action'),
                fn ($q, $action) => $q->where('action', $action)
            )
            ->when(
                $request->input('search'),
                fn ($q, $s) => $q->where(fn ($q) => $q
                    ->where('auditable_label', 'like', "%{$s}%")
                    ->orWhere('auditable_type', 'like', "%{$s}%"))
            )
            ->latest()
            ->paginate(25)
            ->withQueryString();

        return Inertia::render('Audit/Index', [
            'logs' => $logs,
            'filters' => $request->only('search', 'action'),
        ]);
    }
}
