<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\DB;

class ProductTypeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        if ($this->has('nama')) {
            $this->merge([
                'nama' => strtoupper(trim($this->nama)),
            ]);
        }
    }

    public function rules(): array
    {
        $typeId = $this->route('product_type')?->id;

        return [
            'category_id' => ['required', 'exists:product_categories,id'],
            'subtype_id'  => ['required', 'exists:product_subtypes,id'],
            'nama'        => [
                'required',
                'string',
                'max:100',
                function ($attr, $value, $fail) use ($typeId) {
                    $exists = DB::table('product_types')
                        ->whereRaw('UPPER(nama) = ?', [strtoupper($value)])
                        ->where('category_id', $this->category_id)
                        ->where('subtype_id', $this->subtype_id)
                        ->when($typeId, fn ($q) => $q->where('id', '!=', $typeId))
                        ->exists();

                    if ($exists) {
                        $fail('Nama type sudah digunakan (tidak boleh sama meskipun beda huruf besar/kecil).');
                    }
                }
            ],
            'aktif' => ['nullable', 'boolean'],
        ];
    }
}
