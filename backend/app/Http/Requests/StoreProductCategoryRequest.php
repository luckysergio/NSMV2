<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreProductCategoryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'nama' => strtoupper($this->nama),
        ]);
    }

    public function rules(): array
    {
        return [
            'nama' => [
                'required',
                'string',
                'max:100',
                Rule::unique('product_categories', 'nama'),
            ],
            'satuan' => ['required', 'string', 'max:50'],
            'aktif' => ['sometimes', 'boolean'],
        ];
    }
}
