<?php

namespace Database\Seeders;

use Illuminate\Support\Facades\DB;
use Illuminate\Database\Seeder;

class ProductCategorySeeder extends Seeder
{
    public function run(): void
    {
        DB::table('product_categories')->insert([
            [
                'kode' => 'READYMIX',
                'nama' => 'Beton Readymix',
                'satuan' => 'm3',
                'aktif' => true,
            ],
            [
                'kode' => 'POMPA',
                'nama' => 'Pompa Beton',
                'satuan' => 'm3',
                'aktif' => true,
            ],
            [
                'kode' => 'FINISH',
                'nama' => 'Jasa Finishing',
                'satuan' => 'm2',
                'aktif' => true,
            ],
        ]);
    }
}
