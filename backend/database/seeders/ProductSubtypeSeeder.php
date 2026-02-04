<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ProductSubtypeSeeder extends Seeder
{
    public function run(): void
    {
        // Map category by nama
        $categories = DB::table('product_categories')
            ->pluck('id', 'nama');

        $data = [
            // Beton Readymix
            ['category' => 'Beton Readymix', 'nama' => 'Mini'],
            ['category' => 'Beton Readymix', 'nama' => 'Standart'],

            // Pompa Beton
            ['category' => 'Pompa Beton', 'nama' => 'Mini'],
            ['category' => 'Pompa Beton', 'nama' => 'Standart'],
            ['category' => 'Pompa Beton', 'nama' => 'Longboom'],
            ['category' => 'Pompa Beton', 'nama' => 'Super Longboom'],

            // Jasa Finishing
            ['category' => 'Jasa Finishing', 'nama' => 'Natural Lokal'],
            ['category' => 'Jasa Finishing', 'nama' => 'Warna Lokal'],
        ];

        foreach ($data as $row) {
            DB::table('product_subtypes')->insert([
                'category_id' => $categories[$row['category']],
                'nama'        => $row['nama'],
                'aktif'       => true,
            ]);
        }
    }
}
