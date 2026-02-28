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
        Schema::create('user_slack_accounts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->comment('ユーザーID');
            $table->string('slack_user_id', 100)->nullable()->comment('Slack ユーザーID（U***）');
            $table->text('slack_bot_token')->comment('Bot用トークン（暗号化保存）');
            $table->string('slack_channel_id', 100)->comment('投稿先チャンネル/DM ID');
            $table->integer('notification_interval_minutes')->default(0)->comment('通知間隔（分）');
            $table->dateTime('last_notified_at')->nullable()->comment('最終通知日時');
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
        Schema::dropIfExists('user_slack_accounts');
    }
};
