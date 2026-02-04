<?php

namespace App\Services;

use App\Models\ProductCategory;
use App\Models\ProductSubtype;
use App\Models\ProductType;
use Illuminate\Validation\ValidationException;

class ProductService
{
    public function resolveType(array $data): array
    {
        // Case 1: langsung pakai type_id
        if (!empty($data['type_id'])) {
            $type = ProductType::with(['category', 'subtype'])
                ->findOrFail($data['type_id']);

            return [
                'type_id'     => $type->id,
                'category_id' => $type->category_id,
                'subtype_id'  => $type->subtype_id,
            ];
        }

        // Case 2: resolve dari nama (TIDAK CREATE)
        $category = ProductCategory::where('nama', $data['type']['category']['nama'])
            ->first();

        if (!$category) {
            throw ValidationException::withMessages([
                'type.category.nama' => 'Category tidak terdaftar'
            ]);
        }

        $subtype = ProductSubtype::where('nama', $data['type']['subtype']['nama'])
            ->where('category_id', $category->id)
            ->first();

        if (!$subtype) {
            throw ValidationException::withMessages([
                'type.subtype.nama' => 'Subtype tidak terdaftar pada category ini'
            ]);
        }

        $type = ProductType::where('nama', $data['type']['nama'])
            ->where('category_id', $category->id)
            ->where('subtype_id', $subtype->id)
            ->first();

        if (!$type) {
            throw ValidationException::withMessages([
                'type.nama' => 'Type produk tidak terdaftar'
            ]);
        }

        return [
            'type_id'     => $type->id,
            'category_id' => $category->id,
            'subtype_id'  => $subtype->id,
        ];
    }
}
