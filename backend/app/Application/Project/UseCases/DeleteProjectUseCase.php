<?php

declare(strict_types=1);

namespace Application\Project\UseCases;

use Domains\Project\Repositories\ProjectRepositoryInterface;

class DeleteProjectUseCase
{
    public function __construct(
        private readonly ProjectRepositoryInterface $repository
    ) {}

    public function execute(int $id): void
    {
        $this->repository->delete($id);
    }
}