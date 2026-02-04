<?php

namespace App\Observers;

use App\Models\Product;

class ProductObserver
{
    public function saving(Product $product): void
    {
        if (!$product->category_id || !$product->subtype_id || !$product->type_id) {
            return;
        }

        $product->loadMissing(['category', 'subtype', 'type']);

        $category = strtoupper($product->category->nama);
        $subtype  = strtoupper($product->subtype->nama);
        $type     = strtoupper($product->type->nama);

        $categoryCode = substr($category, 0, 1);

        $subtypeCode = collect(explode(' ', $subtype))
            ->map(fn ($w) => substr($w, 0, 1))
            ->implode('');

        $typeCode = str_replace(' ', '', $type);

        $baseKode = $categoryCode . $subtypeCode . $typeCode;
        $kode = $baseKode;
        $i = 1;

        while (
            Product::where('kode_produk', $kode)
                ->when($product->exists, fn ($q) => $q->where('id', '!=', $product->id))
                ->exists()
        ) {
            $kode = "{$baseKode}-{$i}";
            $i++;
        }

        $product->kode_produk = $kode;
        $product->nama_produk = "{$category} {$subtype} {$type}";
    }
}
