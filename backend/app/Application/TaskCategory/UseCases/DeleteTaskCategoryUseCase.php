<?php

declare(strict_types=1);

namespace Application\TaskCategory\UseCases;

use Domains\TaskCategory\Repositories\TaskCategoryRepositoryInterface;

class DeleteTaskCategoryUseCase
{
    public function __construct(
        private readonly TaskCategoryRepositoryInterface $repository
    ) {}

    public function execute(int $id): void
    {
        $this->repository->delete($id);
    }
}