<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ProductTypeSeeder extends Seeder
{
    public function run(): void
    {
        $categories = DB::table('product_categories')->pluck('id', 'kode');
        $subtypes   = DB::table('product_subtypes')->pluck('id', 'nama');

        $data = [
            ['category' => 'READYMIX', 'subtype' => 'Mini', 'nama' => 'K125'],
            ['category' => 'READYMIX', 'subtype' => 'Mini', 'nama' => 'K175'],
            ['category' => 'READYMIX', 'subtype' => 'Mini', 'nama' => 'K225'],
            ['category' => 'READYMIX', 'subtype' => 'Standart', 'nama' => 'K125'],
            ['category' => 'READYMIX', 'subtype' => 'Standart', 'nama' => 'K175'],
            ['category' => 'READYMIX', 'subtype' => 'Standart', 'nama' => 'K225'],

            ['category' => 'POMPA', 'subtype' => 'Mini', 'nama' => '5-25 m3'],
            ['category' => 'POMPA', 'subtype' => 'Standart', 'nama' => '26-50 m3'],
            ['category' => 'POMPA', 'subtype' => 'Longboom', 'nama' => '51-100 m3'],
            ['category' => 'POMPA', 'subtype' => 'Super Longboom', 'nama' => '51-100 m3'],

            ['category' => 'FINISH', 'subtype' => 'Natural Lokal', 'nama' => '3kg/m2'],
            ['category' => 'FINISH', 'subtype' => 'Natural Lokal', 'nama' => '5kg/m2'],
            ['category' => 'FINISH', 'subtype' => 'Warna Lokal', 'nama' => '5kg/m2'],
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
