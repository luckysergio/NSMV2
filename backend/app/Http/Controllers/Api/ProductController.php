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
        ProductService $productService
    ) {
        $data = $request->validated();

        $resolved = $productService->resolveType($data);

        $product = Product::create([
            'type_id'     => $resolved['type_id'],
            'category_id' => $resolved['category_id'],
            'subtype_id'  => $resolved['subtype_id'],
            'harga_jual'  => $data['harga_jual'],
            'aktif'       => true,
        ]);

        return response()->json(
            $product->load(['category', 'subtype', 'type']),
            201
        );
    }

    public function update(
        UpdateProductRequest $request,
        Product $product,
        ProductService $productService
    ) {
        $data = $request->validated();

        if (isset($data['type_id']) || isset($data['type'])) {
            $resolved = $productService->resolveType($data);

            $data['type_id']     = $resolved['type_id'];
            $data['category_id'] = $resolved['category_id'];
            $data['subtype_id']  = $resolved['subtype_id'];
        }

        $product->update($data);

        return $product->load(['category', 'type', 'subtype']);
    }

    public function destroy(Product $product)
    {
        $product->delete();

        return response()->json([
            'message' => 'Produk berhasil dihapus'
        ]);
    }
}
