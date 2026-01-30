<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ProductType extends Model
{
    use HasFactory;

    protected $fillable = [
        'category_id',
        'subtype_id',
        'nama',
        'aktif',
    ];

    protected $casts = [
        'aktif' => 'boolean',
    ];

    public function category()
    {
        return $this->belongsTo(ProductCategory::class, 'category_id');
    }

    public function subtype()
    {
        return $this->belongsTo(ProductSubtype::class, 'subtype_id');
    }

    public function products()
    {
        return $this->hasMany(Product::class, 'type_id');
    }
}
