<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreProductCategoryRequest;
use App\Http\Requests\UpdateProductCategoryRequest;
use App\Models\ProductCategory;

class ProductCategoryController extends Controller
{
    public function index()
    {
        return ProductCategory::latest()->get();
    }

    public function store(StoreProductCategoryRequest $request)
    {
        return ProductCategory::create($request->validated());
    }

    public function show(ProductCategory $product_category)
    {
        return $product_category;
    }

    public function update(UpdateProductCategoryRequest $request, ProductCategory $product_category)
    {
        $product_category->update($request->validated());
        return $product_category;
    }

    public function destroy(ProductCategory $product_category)
    {
        if ($product_category->products()->exists()) {
            return response()->json([
                'message' => 'Category sedang dipakai product'
            ], 422);
        }

        $product_category->delete();
        return response()->noContent();
    }
}
