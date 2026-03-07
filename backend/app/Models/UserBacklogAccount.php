<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserBacklogAccount extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'api_key',
        'backlog_user_id',
        'backlog_space_key',
        'backlog_project_key',
        'is_valid',
    ];

    protected $hidden = [
        'api_key',
    ];

    protected function casts(): array
    {
        return [
            'api_key' => 'encrypted',
            'is_valid' => 'boolean',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
