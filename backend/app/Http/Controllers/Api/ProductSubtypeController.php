<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreProductSubtypeRequest;
use App\Http\Requests\UpdateProductSubtypeRequest;
use App\Models\ProductSubtype;

class ProductSubtypeController extends Controller
{
    public function index()
    {
        return ProductSubtype::with('category')
            ->latest()
            ->get();
    }

    public function store(StoreProductSubtypeRequest $request)
    {
        return ProductSubtype::create($request->validated());
    }

    public function show(ProductSubtype $product_subtype)
    {
        return $product_subtype->load('category');
    }

    public function update(UpdateProductSubtypeRequest $request, ProductSubtype $product_subtype)
    {
        $product_subtype->update($request->validated());
        return $product_subtype->load('category');
    }

    public function destroy(ProductSubtype $product_subtype)
    {
        if ($product_subtype->products()->exists()) {
            return response()->json([
                'message' => 'Subtype sedang dipakai product'
            ], 422);
        }

        $product_subtype->delete();
        return response()->noContent();
    }
}
