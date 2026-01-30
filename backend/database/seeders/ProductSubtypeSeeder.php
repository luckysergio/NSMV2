<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ProductSubtypeSeeder extends Seeder
{
    public function run(): void
    {
        $categories = DB::table('product_categories')->pluck('id', 'kode');

        $data = [
            ['category_id' => $categories['READYMIX'], 'nama' => 'Mini'],
            ['category_id' => $categories['READYMIX'], 'nama' => 'Standart'],

            ['category_id' => $categories['POMPA'], 'nama' => 'Mini'],
            ['category_id' => $categories['POMPA'], 'nama' => 'Standart'],
            ['category_id' => $categories['POMPA'], 'nama' => 'Longboom'],
            ['category_id' => $categories['POMPA'], 'nama' => 'Super Longboom'],

            ['category_id' => $categories['FINISH'], 'nama' => 'Natural Lokal'],
            ['category_id' => $categories['FINISH'], 'nama' => 'Warna Lokal'],
        ];

        foreach ($data as $row) {
            DB::table('product_subtypes')->insert([
                ...$row,
                'aktif' => true,
            ]);
        }
    }
}
