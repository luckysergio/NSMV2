<?php

namespace App\Observers;

use App\Models\Product;
use App\Models\ProductType;

class ProductObserver
{
    public function creating(Product $product): void
    {
        $this->syncFromType($product);
    }

    public function updating(Product $product): void
    {
        if ($product->isDirty('type_id')) {
            $this->syncFromType($product);
        }
    }

    private function syncFromType(Product $product): void
    {
        $type = ProductType::findOrFail($product->type_id);

        $product->category_id = $type->category_id;
        $product->subtype_id  = $type->subtype_id;
    }
}
