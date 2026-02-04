<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('kode_produk')->unique();

            $table->foreignId('category_id')->constrained('product_categories');

            $table->foreignId('type_id')->constrained('product_types')->unique();;

            $table->foreignId('subtype_id')->constrained('product_subtypes');

            $table->string('nama_produk');
            $table->decimal('harga_jual', 15, 2);
            $table->boolean('aktif')->default(true);

            $table->timestamps();

            $table->index(['category_id', 'type_id', 'subtype_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
