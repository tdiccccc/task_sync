<?php

declare(strict_types=1);

namespace Application\Project\UseCases;

use Domains\Project\Entities\ProjectEntity;
use Domains\Project\Repositories\ProjectRepositoryInterface;

class CreateProjectUseCase
{
    public function __construct(
        private readonly ProjectRepositoryInterface $repository
    ) {}

    public function execute(
        string $name,
        float $amount,
        string $description,
        ?string $startedAt,
        ?string $endedAt,
        bool $isActive,
    ): ProjectEntity {
        return $this->repository->create(
            $name,
            $amount,
            $description,
            $startedAt,
            $endedAt,
            $isActive,
        );
    }
}