<?php

namespace App\Services;

use App\Models\ProductCategory;
use App\Models\ProductSubtype;
use App\Models\ProductType;
use Illuminate\Support\Facades\DB;

class ProductService
{
    public function resolveType(array $data): array
    {
        return DB::transaction(function () use ($data) {

            if (!empty($data['type_id'])) {
                $type = ProductType::with(['category', 'subtype'])
                    ->findOrFail($data['type_id']);
            } else {
                $category = ProductCategory::firstOrCreate([
                    'nama' => $data['type']['category']['nama'],
                ]);

                $subtype = ProductSubtype::firstOrCreate([
                    'nama'        => $data['type']['subtype']['nama'],
                    'category_id' => $category->id,
                ]);

                $type = ProductType::firstOrCreate([
                    'nama'        => $data['type']['nama'],
                    'category_id' => $category->id,
                    'subtype_id'  => $subtype->id,
                ]);
            }

            return [
                'type_id'     => $type->id,
                'category_id' => $type->category_id,
                'subtype_id'  => $type->subtype_id,
            ];
        });
    }
}
