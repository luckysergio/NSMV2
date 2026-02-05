<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateProductSubtypeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        if ($this->has('nama')) {
            $this->merge([
                'nama' => strtoupper($this->nama),
            ]);
        }
    }

    public function rules(): array
    {
        $id = $this->route('product_subtype')->id ?? $this->route('product_subtype');

        return [
            'category_id' => ['sometimes', 'required', 'exists:product_categories,id'],
            'nama' => [
                'sometimes',
                'required',
                'string',
                'max:100',
                Rule::unique('product_subtypes')
                    ->ignore($id)
                    ->where(
                        fn($q) =>
                        $q->where('category_id', $this->category_id)
                    ),
            ],
            'aktif' => ['sometimes', 'boolean'],
        ];
    }
}
