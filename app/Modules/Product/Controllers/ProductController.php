<?php

namespace App\Modules\Product\Controllers;

use App\Modules\Product\Models\Product;
use App\Modules\Product\Requests\StoreProductRequest;
use App\Modules\Product\Requests\UpdateProductRequest;
use App\Modules\Product\Services\ProductService;
use App\Shared\BaseController;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends BaseController
{
    public function __construct(
        private readonly ProductService $service
    ) {}

    public function index(Request $request): Response
    {
        abort_unless(auth()->user()->can('products.view'), 403);

        return Inertia::render('Product/Index', [
            'products' => $this->service->paginate($request->only('search')),
            'filters' => $request->only('search'),
        ]);
    }

    public function create(): Response
    {
        abort_unless(auth()->user()->can('products.create'), 403);

        return Inertia::render('Product/Create');
    }

    public function store(StoreProductRequest $request): RedirectResponse
    {
        $this->service->create($request->validated());

        return redirect()->route('products.index')->with('success', 'Yaratildi');
    }

    public function edit(Product $product): Response
    {
        abort_unless(auth()->user()->can('products.edit'), 403);

        return Inertia::render('Product/Edit', [
            'product' => $product,
        ]);
    }

    public function update(UpdateProductRequest $request, Product $product): RedirectResponse
    {
        $this->service->update($product, $request->validated());

        return redirect()->route('products.index')->with('success', 'Yangilandi');
    }

    public function destroy(Product $product): RedirectResponse
    {
        abort_unless(auth()->user()->can('products.delete'), 403);

        $this->service->delete($product);

        return redirect()->route('products.index')->with('success', "O'chirildi");
    }

    public function trashed(Request $request): Response
    {
        abort_unless(auth()->user()->can('products.delete'), 403);

        return Inertia::render('Product/Trashed', [
            'products' => $this->service->trashed($request->only('search')),
            'filters' => $request->only('search'),
        ]);
    }

    public function restore(int $id): RedirectResponse
    {
        abort_unless(auth()->user()->can('products.delete'), 403);

        $this->service->restore($id);

        return back()->with('success', 'Tiklandi');
    }

    public function forceDelete(int $id): RedirectResponse
    {
        abort_unless(auth()->user()->can('products.delete'), 403);

        $this->service->forceDelete($id);

        return back()->with('success', "Butunlay o'chirildi");
    }
}
