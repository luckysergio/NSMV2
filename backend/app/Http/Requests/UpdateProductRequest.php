<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateProductRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }
    
    protected function prepareForValidation(): void
    {
        $this->merge([
            'kode_produk' => strtoupper($this->kode_produk),
            'nama_produk' => strtoupper($this->nama_produk),
        ]);
    }

    public function rules(): array
    {
        $productId = $this->route('product')?->id ?? $this->route('product');

        return [
            'kode_produk' => 'required|string|max:50|unique:products,kode_produk,' . $productId,
            'type_id'     => 'required|exists:product_types,id',
            'nama_produk' => 'required|string|max:255',
            'harga_jual'  => 'required|numeric|min:0',
            'aktif'       => 'sometimes|boolean',
        ];
    }
}
