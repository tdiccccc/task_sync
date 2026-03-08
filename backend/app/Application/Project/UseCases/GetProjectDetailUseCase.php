<?php

declare(strict_types=1);

namespace Application\Project\UseCases;

use Domains\Project\Entities\ProjectEntity;
use Domains\Project\Repositories\ProjectRepositoryInterface;

class GetProjectDetailUseCase
{
    public function __construct(
        private readonly ProjectRepositoryInterface $repository
    ) {}

    public function execute(int $id): ?ProjectEntity
    {
        return $this->repository->findById($id);
    }
}