<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ProductCategory extends Model
{
    use HasFactory;

    protected $fillable = [
        'nama',
        'satuan',
        'aktif',
    ];

    protected $casts = [
        'aktif' => 'boolean',
    ];

    public function subtypes()
    {
        return $this->hasMany(ProductSubtype::class, 'category_id');
    }

    public function types()
    {
        return $this->hasMany(ProductType::class, 'category_id');
    }

    public function products()
    {
        return $this->hasMany(Product::class, 'category_id');
    }
}
