<?php

declare(strict_types=1);

namespace Application\TaskCategory\UseCases;

use Domains\TaskCategory\Repositories\TaskCategoryRepositoryInterface;

class GetTaskCategoryListUseCase
{
    public function __construct(
        private readonly TaskCategoryRepositoryInterface $repository
    ) {}

    /**
     * @return \Domains\TaskCategory\Entities\TaskCategoryEntity[]
     */
    public function execute(int $projectId): array
    {
        return $this->repository->findByProjectId($projectId);
    }
}