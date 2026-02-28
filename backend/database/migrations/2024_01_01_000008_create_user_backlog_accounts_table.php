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
        Schema::create('user_backlog_accounts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->comment('ユーザーID');
            $table->text('api_key')->comment('Backlog APIキー（暗号化保存）');
            $table->string('backlog_user_id', 100)->nullable()->comment('Backlog ユーザーID/name');
            $table->string('backlog_space_key', 100)->comment('スペースキー（xxx.backlog.jp）');
            $table->string('backlog_project_key', 100)->nullable()->comment('プロジェクトキー');
            $table->boolean('is_valid')->default(true)->comment('接続有効フラグ');
            $table->timestamps();

            $table->index('user_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_backlog_accounts');
    }
};
