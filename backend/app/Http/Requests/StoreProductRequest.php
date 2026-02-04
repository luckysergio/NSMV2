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
            'type' => $this->type ? [
                'nama' => strtoupper($this->type['nama'] ?? ''),
                'category' => [
                    'nama' => strtoupper($this->type['category']['nama'] ?? ''),
                ],
                'subtype' => [
                    'nama' => strtoupper($this->type['subtype']['nama'] ?? ''),
                ],
            ] : null,
        ]);
    }

    public function rules(): array
    {
        return [
            'harga_jual' => 'required|numeric|min:0',

            'type_id' => 'nullable|exists:product_types,id',

            'type.nama' => 'required_without:type_id|string|max:100',
            'type.category.nama' => 'required_without:type_id|string|max:100',
            'type.subtype.nama' => 'required_without:type_id|string|max:100',
        ];
    }
}
