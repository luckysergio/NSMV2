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
        if ($this->has('kode_produk')) {
            $this->merge([
                'kode_produk' => strtoupper($this->kode_produk),
            ]);
        }

        if ($this->has('nama_produk')) {
            $this->merge([
                'nama_produk' => strtoupper($this->nama_produk),
            ]);
        }
    }

    public function rules(): array
    {
        $productId = $this->route('product') instanceof \App\Models\Product
            ? $this->route('product')->id
            : $this->route('product');

        return [
            'kode_produk' => [
                'sometimes',
                'required',
                'string',
                'max:50',
                'unique:products,kode_produk,' . $productId,
            ],

            'type_id' => [
                'sometimes',
                'required',
                'exists:product_types,id',
            ],

            'nama_produk' => [
                'sometimes',
                'required',
                'string',
                'max:255',
            ],

            'harga_jual' => [
                'sometimes',
                'required',
                'numeric',
                'min:0',
            ],

            'aktif' => ['sometimes', 'boolean'],
        ];
    }
}
