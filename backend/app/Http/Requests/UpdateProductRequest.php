<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateProductRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'kode_produk' => 'required|string|max:50|unique:products,kode_produk,' . $this->route('product'),
            'type_id'     => 'required|exists:product_types,id',
            'nama_produk' => 'required|string|max:255',
            'harga_jual'  => 'required|numeric|min:0',
            'aktif'       => 'sometimes|boolean',
        ];
    }
}

