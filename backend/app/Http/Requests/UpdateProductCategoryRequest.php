<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateProductCategoryRequest extends FormRequest
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
        $categoryId = $this->route('category');

        return [
            'nama' => [
                'required',
                'string',
                'max:100',
                Rule::unique('product_categories', 'nama')->ignore($categoryId),
            ],
            'satuan' => ['required', 'string', 'max:50'],
            'aktif' => ['sometimes', 'boolean'],
        ];
    }
}
