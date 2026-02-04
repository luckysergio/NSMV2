<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreProductRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'kode_produk' => $this->kode_produk
                ? strtoupper($this->kode_produk)
                : null,

            'nama_produk' => $this->nama_produk
                ? strtoupper($this->nama_produk)
                : null,

            'type' => $this->type ? [
                'nama' => isset($this->type['nama'])
                    ? strtoupper($this->type['nama'])
                    : null,
                'category' => [
                    'nama' => isset($this->type['category']['nama'])
                        ? strtoupper($this->type['category']['nama'])
                        : null,
                ],
                'subtype' => [
                    'nama' => isset($this->type['subtype']['nama'])
                        ? strtoupper($this->type['subtype']['nama'])
                        : null,
                ],
            ] : null,
        ]);
    }

    public function rules(): array
    {
        return [
            // auto-generate, optional
            'kode_produk' => 'nullable|string|max:50|unique:products,kode_produk',
            'nama_produk' => 'nullable|string|max:255',

            'harga_jual'  => 'required|numeric|min:0',

            'type_id' => 'nullable|exists:product_types,id',

            // required jika type_id kosong
            'type.nama' => 'required_without:type_id|string|max:100',
            'type.category.nama' => 'required_without:type_id|string|max:100',
            'type.subtype.nama' => 'required_without:type_id|string|max:100',
        ];
    }
}
