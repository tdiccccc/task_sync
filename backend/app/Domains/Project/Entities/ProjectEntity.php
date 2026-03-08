<?php

declare(strict_types=1);

namespace Domains\Project\Entities;

/**
 * プロジェクトエンティティ
 *
 * イミュータブル（不変）なドメインオブジェクト。
 * ビジネスデータの構造を定義し、外部依存を持たない。
 */
readonly class ProjectEntity
{
    public function __construct(
        public int $id,
        public string $name,
        public float $amount,
        public string $description,
        public ?string $startedAt,
        public ?string $endedAt,
        public bool $isActive,
        public string $createdAt,
        public string $updatedAt,
    ) {}
}