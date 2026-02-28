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
        Schema::create('work_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->comment('ユーザーID');
            $table->foreignId('project_id')->constrained('projects')->comment('プロジェクトID');
            $table->foreignId('task_category_id')->nullable()->constrained('task_categories')->comment('カテゴリID');
            $table->foreignId('task_id')->constrained('tasks')->comment('タスクID');
            $table->date('work_date')->comment('実績日');
            $table->integer('work_minutes')->comment('作業時間（分単位）');
            $table->text('comment')->nullable()->comment('作業メモ');
            $table->timestamps();

            $table->index('user_id');
            $table->index('project_id');
            $table->index('task_category_id');
            $table->index('task_id');
            $table->index('work_date');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('work_logs');
    }
};
