<?php

declare(strict_types=1);

namespace Domains\TaskCategory\Entities;

/**
 * タスクカテゴリエンティティ
 *
 * イミュータブル（不変）なドメインオブジェクト。
 * プロジェクトに紐づくカテゴリのビジネスデータを定義する。
 */
readonly class TaskCategoryEntity
{
    public function __construct(
        public int $id,
        public int $projectId,
        public string $name,
        public ?string $description,
        public ?string $color,
        public int $sortOrder,
        public string $createdAt,
        public string $updatedAt,
    ) {}
}