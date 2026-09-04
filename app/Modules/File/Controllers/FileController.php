<?php

namespace App\Modules\File\Controllers;

use App\Modules\File\Models\File;
use App\Modules\File\Requests\StoreFileRequest;
use App\Modules\File\Services\FileService;
use App\Shared\BaseController;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

class FileController extends BaseController
{
    public function __construct(
        private readonly FileService $service
    ) {}

    public function index(Request $request): Response
    {
        abort_unless(
            $request->user()->canAny(['files.view', 'files.ownview']),
            403
        );

        $filters = $request->only('search', 'category');
        $scopeOnly = [];

        if (! $request->user()->can('files.view') && $request->user()->can('files.ownview')) {
            $filters['only_user_id'] = $request->user()->id;
            $scopeOnly['only_user_id'] = $request->user()->id;
        }

        return Inertia::render('File/Index', [
            'files' => $this->service->paginate($filters),
            'stats' => $this->service->stats($scopeOnly + $request->only('search')),
            'filters' => $request->only('search', 'category'),
        ]);
    }

    public function store(StoreFileRequest $request): RedirectResponse
    {
        foreach ($request->file('files') as $uploaded) {
            $this->service->upload($uploaded, $request->user());
        }

        return back()->with('success', 'Fayl(lar) yuklandi');
    }

    public function download(File $file): StreamedResponse
    {
        $this->authorizeAccess($file);

        return Storage::disk($file->disk)->download($file->path, $file->name);
    }

    public function destroy(File $file): RedirectResponse
    {
        abort_unless(auth()->user()->can('files.delete'), 403);
        $this->authorizeAccess($file);

        $this->service->delete($file);

        return back()->with('success', "Fayl savatga o'tkazildi");
    }

    public function trashed(Request $request): Response
    {
        abort_unless(auth()->user()->can('files.delete'), 403);

        $filters = [];
        if (! $request->user()->can('files.view')) {
            $filters['only_user_id'] = $request->user()->id;
        }

        return Inertia::render('File/Trashed', [
            'files' => $this->service->trashed($filters),
        ]);
    }

    public function restore(int $id): RedirectResponse
    {
        abort_unless(auth()->user()->can('files.delete'), 403);

        $file = File::onlyTrashed()->findOrFail($id);
        $this->authorizeAccess($file);
        $this->service->restore($file);

        return back()->with('success', 'Fayl tiklandi');
    }

    public function forceDelete(int $id): RedirectResponse
    {
        abort_unless(auth()->user()->can('files.delete'), 403);

        $file = File::onlyTrashed()->findOrFail($id);
        $this->authorizeAccess($file);
        $this->service->forceDelete($file);

        return back()->with('success', "Fayl butunlay o'chirildi");
    }

    protected function authorizeAccess(File $file): void
    {
        $user = auth()->user();

        if ($user->can('files.view')) {
            return;
        }

        abort_unless($user->can('files.ownview') && $file->user_id === $user->id, 403);
    }
}
