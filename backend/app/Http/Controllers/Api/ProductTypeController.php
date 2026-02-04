<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\ProductTypeRequest;
use App\Models\ProductType;

class ProductTypeController extends Controller
{
    /* =========================
        INDEX
    ========================= */
    public function index()
    {
        return response()->json(
            ProductType::with(['category', 'subtype'])
                ->orderBy('nama')
                ->get()
        );
    }

    /* =========================
        STORE
    ========================= */
    public function store(ProductTypeRequest $request)
    {
        $type = ProductType::create([
            'category_id' => $request->category_id,
            'subtype_id'  => $request->subtype_id,
            'nama'        => $request->nama,
            'aktif'       => $request->aktif ?? true,
        ]);

        return response()->json([
            'message' => 'Product type berhasil dibuat',
            'data'    => $type->load(['category', 'subtype']),
        ], 201);
    }

    /* =========================
        SHOW
    ========================= */
    public function show(ProductType $productType)
    {
        return response()->json(
            $productType->load(['category', 'subtype'])
        );
    }

    /* =========================
        UPDATE
    ========================= */
    public function update(ProductTypeRequest $request, ProductType $productType)
    {
        $productType->update([
            'category_id' => $request->category_id,
            'subtype_id'  => $request->subtype_id,
            'nama'        => $request->nama,
            'aktif'       => $request->aktif ?? $productType->aktif,
        ]);

        return response()->json([
            'message' => 'Product type berhasil diperbarui',
            'data'    => $productType->load(['category', 'subtype']),
        ]);
    }

    /* =========================
        DELETE
    ========================= */
    public function destroy(ProductType $productType)
    {
        if ($productType->products()->exists()) {
            return response()->json([
                'message' => 'Product type tidak dapat dihapus karena masih digunakan produk'
            ], 422);
        }

        $productType->delete();

        return response()->json([
            'message' => 'Product type berhasil dihapus'
        ]);
    }
}
