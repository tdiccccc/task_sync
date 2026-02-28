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
        Schema::create('projects', function (Blueprint $table) {
            $table->id();
            $table->string('name')->comment('案件名');
            $table->decimal('amount', 12, 2)->nullable()->comment('受注金額');
            $table->text('description')->nullable()->comment('案件の概要');
            $table->dateTime('started_at')->nullable()->comment('着手日');
            $table->dateTime('ended_at')->nullable()->comment('完了日');
            $table->boolean('is_active')->default(true)->comment('進行中フラグ');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('projects');
    }
};
