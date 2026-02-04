<?php

namespace App\Services;

use App\Models\ProductType;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class ProductService
{
    public function resolveType(array $data): array
    {
        return DB::transaction(function () use ($data) {

            if (!empty($data['type_id'])) {
                $type = ProductType::with(['category', 'subtype'])
                    ->findOrFail($data['type_id']);
            }
            else {
                $type = ProductType::with(['category', 'subtype'])
                    ->where('nama', $data['type']['nama'])
                    ->whereHas('category', fn ($q) =>
                        $q->where('nama', $data['type']['category']['nama'])
                    )
                    ->whereHas('subtype', fn ($q) =>
                        $q->where('nama', $data['type']['subtype']['nama'])
                    )
                    ->first();

                if (!$type) {
                    throw ValidationException::withMessages([
                        'type' => 'Category / Subtype / Type belum terdaftar. Silakan pilih data master yang sudah ada.',
                    ]);
                }
            }

            return [
                'type_id'     => $type->id,
                'category_id' => $type->category_id,
                'subtype_id'  => $type->subtype_id,
            ];
        });
    }
}
