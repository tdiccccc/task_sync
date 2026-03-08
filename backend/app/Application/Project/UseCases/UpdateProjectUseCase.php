<?php

declare(strict_types=1);

namespace Application\Project\UseCases;

use Domains\Project\Entities\ProjectEntity;
use Domains\Project\Repositories\ProjectRepositoryInterface;

class UpdateProjectUseCase
{
    public function __construct(
        private readonly ProjectRepositoryInterface $repository
    ) {}

    public function execute(
        int $id,
        string $name,
        float $amount,
        string $description,
        ?string $startedAt,
        ?string $endedAt,
        bool $isActive,
    ): ProjectEntity {
        return $this->repository->update(
            $id,
            $name,
            $amount,
            $description,
            $startedAt,
            $endedAt,
            $isActive,
        );
    }
}