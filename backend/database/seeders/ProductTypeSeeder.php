<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ProductTypeSeeder extends Seeder
{
    public function run(): void
    {
        // Map kategori & subtype by nama
        $categories = DB::table('product_categories')
            ->pluck('id', 'nama');

        $subtypes = DB::table('product_subtypes')
            ->pluck('id', 'nama');

        $data = [
            // Beton Readymix - Mini
            ['category' => 'Beton Readymix', 'subtype' => 'Mini', 'nama' => 'K125'],
            ['category' => 'Beton Readymix', 'subtype' => 'Mini', 'nama' => 'K175'],
            ['category' => 'Beton Readymix', 'subtype' => 'Mini', 'nama' => 'K225'],

            // Beton Readymix - Standart
            ['category' => 'Beton Readymix', 'subtype' => 'Standart', 'nama' => 'K125'],
            ['category' => 'Beton Readymix', 'subtype' => 'Standart', 'nama' => 'K175'],
            ['category' => 'Beton Readymix', 'subtype' => 'Standart', 'nama' => 'K225'],

            // Pompa Beton
            ['category' => 'Pompa Beton', 'subtype' => 'Mini', 'nama' => '5-25 m3'],
            ['category' => 'Pompa Beton', 'subtype' => 'Standart', 'nama' => '26-50 m3'],
            ['category' => 'Pompa Beton', 'subtype' => 'Longboom', 'nama' => '51-100 m3'],
            ['category' => 'Pompa Beton', 'subtype' => 'Super Longboom', 'nama' => '51-100 m3'],

            // Jasa Finishing
            ['category' => 'Jasa Finishing', 'subtype' => 'Natural Lokal', 'nama' => '3kg/m2'],
            ['category' => 'Jasa Finishing', 'subtype' => 'Natural Lokal', 'nama' => '5kg/m2'],
            ['category' => 'Jasa Finishing', 'subtype' => 'Warna Lokal', 'nama' => '5kg/m2'],
        ];

        foreach ($data as $row) {
            DB::table('product_types')->insert([
                'category_id' => $categories[$row['category']],
                'subtype_id'  => $subtypes[$row['subtype']],
                'nama'        => $row['nama'],
                'aktif'       => true,
            ]);
        }
    }
}
