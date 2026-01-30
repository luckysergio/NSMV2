<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'kode_produk',
        'category_id',
        'type_id',
        'subtype_id',
        'nama_produk',
        'harga_jual',
        'aktif',
    ];

    protected $casts = [
        'aktif' => 'boolean',
        'harga_jual' => 'decimal:2',
    ];

    public function category()
    {
        return $this->belongsTo(ProductCategory::class, 'category_id');
    }

    public function type()
    {
        return $this->belongsTo(ProductType::class, 'type_id');
    }

    public function subtype()
    {
        return $this->belongsTo(ProductSubtype::class, 'subtype_id');
    }
}
