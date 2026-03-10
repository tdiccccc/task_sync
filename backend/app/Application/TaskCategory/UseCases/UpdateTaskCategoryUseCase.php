<?php

declare(strict_types=1);

namespace Application\TaskCategory\UseCases;

use Domains\TaskCategory\Entities\TaskCategoryEntity;
use Domains\TaskCategory\Repositories\TaskCategoryRepositoryInterface;

class UpdateTaskCategoryUseCase
{
    public function __construct(
        private readonly TaskCategoryRepositoryInterface $repository
    ) {}

    public function execute(
        int $id,
        string $name,
        ?string $description,
        ?string $color,
        int $sortOrder,
    ): TaskCategoryEntity {
        return $this->repository->update(
            $id,
            $name,
            $description,
            $color,
            $sortOrder,
        );
    }
}