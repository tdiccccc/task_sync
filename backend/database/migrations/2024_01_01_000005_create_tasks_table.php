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
        Schema::create('tasks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('project_id')->constrained('projects')->comment('プロジェクトID');
            $table->foreignId('task_category_id')->nullable()->constrained('task_categories')->comment('カテゴリID');
            $table->string('name')->comment('タスク名');
            $table->text('description')->nullable()->comment('詳細内容');
            $table->string('status', 50)->default('open')->comment('ステータス');
            $table->decimal('estimated_hours', 5, 2)->nullable()->comment('見積もり時間');
            $table->foreignId('created_by')->constrained('users')->comment('作成者');
            $table->foreignId('assigned_to')->nullable()->constrained('users')->comment('担当者');
            $table->date('due_date')->nullable()->comment('期限');
            $table->dateTime('archived_at')->nullable()->comment('アーカイブ日時');
            $table->timestamps();

            $table->index('project_id');
            $table->index('task_category_id');
            $table->index('created_by');
            $table->index('assigned_to');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tasks');
    }
};
