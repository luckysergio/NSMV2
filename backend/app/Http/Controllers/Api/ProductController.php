<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreProductRequest;
use App\Http\Requests\UpdateProductRequest;
use App\Models\Product;
use App\Services\ProductService;

class ProductController extends Controller
{
    public function index()
    {
        return Product::with(['category', 'type', 'subtype'])
            ->where('aktif', true)
            ->get();
    }

    public function show(Product $product)
    {
        return $product->load(['category', 'type', 'subtype']);
    }

    public function store(
        StoreProductRequest $request,
        ProductService $service
    ) {
        $resolved = $service->resolveType($request->validated());

        $product = Product::create([
            ...$resolved,
            'harga_jual' => $request->harga_jual,
            'aktif' => true,
        ]);

        return response()->json(
            $product->load(['category', 'type', 'subtype']),
            201
        );
    }

    public function update(
        UpdateProductRequest $request,
        Product $product,
        ProductService $service
    ) {
        $data = $request->validated();

        $resolved = [];

        // HANYA resolve kalau ada perubahan type
        if (isset($data['type_id']) || isset($data['type'])) {
            $resolved = $service->resolveType($data);
        }

        $product->update([
            ...$data,
            ...$resolved,
        ]);

        return $product->load(['category', 'type', 'subtype']);
    }

    public function destroy(Product $product)
    {
        $product->delete();

        return response()->json([
            'message' => 'Produk berhasil dihapus',
        ]);
    }
}
