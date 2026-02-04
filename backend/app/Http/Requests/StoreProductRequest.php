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
        if ($this->has('type')) {
            $this->merge([
                'type' => [
                    'nama' => strtoupper(data_get($this->type, 'nama')),
                    'category' => [
                        'nama' => strtoupper(data_get($this->type, 'category.nama')),
                    ],
                    'subtype' => [
                        'nama' => strtoupper(data_get($this->type, 'subtype.nama')),
                    ],
                ],
            ]);
        }
    }

    public function rules(): array
    {
        return [
            'harga_jual' => ['required', 'numeric', 'min:0'],

            'type_id' => [
                'nullable',
                'exists:product_types,id',
                'unique:products,type_id', // ⬅️ PENTING
            ],

            'type.nama' => ['required_without:type_id', 'string', 'max:100'],
            'type.category.nama' => ['required_without:type_id', 'string', 'max:100'],
            'type.subtype.nama' => ['required_without:type_id', 'string', 'max:100'],
        ];
    }

    public function messages(): array
    {
        return [
            'type_id.unique' => 'Type ini sudah digunakan oleh product lain',
        ];
    }
}
