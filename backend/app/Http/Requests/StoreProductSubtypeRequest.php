<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreProductSubtypeRequest extends FormRequest
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
            'category_id' => ['required', 'exists:product_categories,id'],
            'nama' => [
                'required',
                'string',
                'max:100',
                Rule::unique('product_subtypes')
                    ->where(
                        fn($q) =>
                        $q->where('category_id', $this->category_id)
                    ),
            ],
            'aktif' => ['sometimes', 'boolean'],
        ];
    }
}
