<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('task_categories', function (Blueprint $table) {
            $table->id();
            $table->foreignId('project_id')->constrained('projects')->comment('プロジェクトID');
            $table->string('name')->comment('カテゴリ名（要件定義など）');
            $table->text('description')->nullable()->comment('説明');
            $table->string('color', 20)->nullable()->comment('ラベル色（UI用）');
            $table->integer('sort_order')->default(0)->comment('表示順');
            $table->timestamps();

            $table->index('project_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('task_categories');
    }
};
