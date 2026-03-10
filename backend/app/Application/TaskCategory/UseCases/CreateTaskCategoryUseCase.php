<?php

declare(strict_types=1);

namespace Application\TaskCategory\UseCases;

use Domains\TaskCategory\Entities\TaskCategoryEntity;
use Domains\TaskCategory\Repositories\TaskCategoryRepositoryInterface;

class CreateTaskCategoryUseCase
{
    public function __construct(
        private readonly TaskCategoryRepositoryInterface $repository
    ) {}

    public function execute(
        int $projectId,
        string $name,
        ?string $description,
        ?string $color,
        int $sortOrder,
    ): TaskCategoryEntity {
        return $this->repository->create(
            $projectId,
            $name,
            $description,
            $color,
            $sortOrder,
        );
    }
}