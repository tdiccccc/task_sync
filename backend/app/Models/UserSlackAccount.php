<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserSlackAccount extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'slack_user_id',
        'slack_bot_token',
        'slack_channel_id',
        'notification_interval_minutes',
        'last_notified_at',
        'is_valid',
    ];

    protected $hidden = [
        'slack_bot_token',
    ];

    protected function casts(): array
    {
        return [
            'slack_bot_token' => 'encrypted',
            'notification_interval_minutes' => 'integer',
            'last_notified_at' => 'datetime',
            'is_valid' => 'boolean',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
