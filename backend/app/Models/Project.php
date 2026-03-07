<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Project extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'name',
        'amount',
        'description',
        'started_at',
        'ended_at',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'amount' => 'decimal:2',
            'started_at' => 'datetime',
            'ended_at' => 'datetime',
            'is_active' => 'boolean',
        ];
    }

    public function taskCategories(): HasMany
    {
        return $this->hasMany(TaskCategory::class);
    }

    public function tasks(): HasMany
    {
        return $this->hasMany(Task::class);
    }

    public function workLogs(): HasMany
    {
        return $this->hasMany(WorkLog::class);
    }
}
